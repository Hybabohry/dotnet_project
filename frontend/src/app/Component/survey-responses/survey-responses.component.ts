import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Ajout de RouterModule
import { SurveyService } from '../../services/services/survey.service';
import { TokenService } from '../../services/services/token.service';
import { LoginService } from '../../services/services/login.service'; // Ajout de LoginService
import { SurveyResponseViewDto, SurveyDto } from '../../services/models/survey-dto';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Enregistrer les modules Chart.js nécessaires
Chart.register(...registerables);

@Component({
  selector: 'app-survey-responses',
  standalone: true,
  imports: [CommonModule, RouterModule], // Ajout de RouterModule
  templateUrl: './survey-responses.component.html',
  styleUrls: ['./survey-responses.component.css']
})
export class SurveyResponsesComponent implements OnInit, AfterViewInit {
  responses: SurveyResponseViewDto[] = [];
  survey: SurveyDto | null = null;
  surveyId: string | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  groupedResponses: { employeeId: string, employeeName: string, respondedAt: string, answers: { questionText: string, answer: string }[] }[] = [];
  stats: { 
    totalResponses: number, 
    participationRate: number, 
    averages: { questionId: string, questionText: string, average: number }[], 
    distributions: { questionId: string, questionText: string, options: { [key: string]: number } }[] 
  } = {
    totalResponses: 0,
    participationRate: 0,
    averages: [],
    distributions: []
  };
  totalEmployees: number = 0;

  constructor(
    private surveyService: SurveyService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService // Ajout de LoginService
  ) {}

  ngOnInit(): void {
    this.checkUserAccess();
    this.surveyId = this.route.snapshot.paramMap.get('surveyId');
    if (this.surveyId) {
      this.loadSurvey(this.surveyId);
      this.loadResponses(this.surveyId);
      this.loadTotalEmployees();
    } else {
      this.errorMessage = 'Survey ID not provided.';
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createCharts();
    }, 100);
  }

  checkUserAccess(): void {
    const token = this.tokenService.token;
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const userInfo = this.tokenService.user;
    if (!userInfo || userInfo.UserType !== 1) { // UserType 1 = HR
      this.router.navigate(['/employee-dashboard']);
      return;
    }
  }

  loadSurvey(surveyId: string): void {
    this.surveyService.apiSurveyGetById$Json({ id: surveyId }).subscribe({
      next: (survey: SurveyDto) => {
        this.survey = survey;
        console.log('Survey loaded:', this.survey);
      },
      error: (error: any) => {
        console.error('Error while fetching the survey:', error);
        this.errorMessage = 'An error occurred while fetching the survey.';
      }
    });
  }

  loadTotalEmployees(): void {
    this.surveyService.apiSurveyGetTotalEmployeesGet$Json().subscribe({
      next: (data: { totalEmployees: number }) => {
        this.totalEmployees = data.totalEmployees;
        this.calculateStats();
      },
      error: (error: any) => {
        console.error('Error while fetching total employees:', error);
        this.totalEmployees = 0;
      }
    });
  }

  loadResponses(surveyId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.surveyService.apiSurveyGetResponsesGet$Json({ surveyId }).subscribe({
      next: (responses: SurveyResponseViewDto[]) => {
        this.responses = responses || [];
        console.log('Responses loaded:', this.responses);
        this.groupResponses();
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error while fetching responses:', error);
        this.errorMessage = 'An error occurred while fetching the responses.';
        this.isLoading = false;
      }
    });
  }

  groupResponses(): void {
    const groupedByEmployee: { [key: string]: { employeeId: string, employeeName: string, respondedAt: string, answers: { questionText: string, answer: string }[] } } = {};

    for (const response of this.responses) {
      const employeeId = response.EmployeeId;
      const employeeName = response.EmployeeName || 'Unknown Employee';
      const questionText = this.getQuestionText(response.QuestionId) || 'Unknown Question';

      if (!groupedByEmployee[employeeId]) {
        groupedByEmployee[employeeId] = {
          employeeId,
          employeeName,
          respondedAt: response.RespondedAt,
          answers: []
        };
      }

      groupedByEmployee[employeeId].answers.push({
        questionText,
        answer: response.Answer
      });
    }

    this.groupedResponses = Object.values(groupedByEmployee);
  }

  calculateStats(): void {
    if (!this.survey || !this.survey.Questions) return;

    const uniqueEmployees = new Set(this.responses.map(r => r.EmployeeId));
    this.stats.totalResponses = uniqueEmployees.size;
    this.stats.participationRate = this.totalEmployees > 0 ? (this.stats.totalResponses / this.totalEmployees) * 100 : 0;

    const ratingQuestions = this.survey.Questions.filter(q => q.Type === 'rating');
    const averages: { questionId: string, questionText: string, average: number }[] = [];

    for (const question of ratingQuestions) {
      const questionResponses = this.responses.filter(r => r.QuestionId === question.Id);
      const total = questionResponses.reduce((sum, r) => sum + (parseFloat(r.Answer) || 0), 0);
      const count = questionResponses.length;
      const average = count > 0 ? total / count : 0;
      averages.push({
        questionId: question.Id,
        questionText: question.Text,
        average: parseFloat(average.toFixed(2))
      });
    }
    this.stats.averages = averages;

    const radioQuestions = this.survey.Questions.filter(q => q.Type === 'radio');
    const distributions: { questionId: string, questionText: string, options: { [key: string]: number } }[] = [];

    for (const question of radioQuestions) {
      const questionResponses = this.responses.filter(r => r.QuestionId === question.Id);
      const options: { [key: string]: number } = {};

      question.Options?.forEach(option => {
        options[option] = 0;
      });

      questionResponses.forEach(r => {
        if (r.Answer in options) {
          options[r.Answer]++;
        }
      });

      distributions.push({
        questionId: question.Id,
        questionText: question.Text,
        options
      });
    }
    this.stats.distributions = distributions;

    console.log('Rating Questions:', ratingQuestions);
    console.log('Radio Questions:', radioQuestions);
    console.log('Averages:', this.stats.averages);
    console.log('Distributions:', this.stats.distributions);
  }

  createCharts(): void {
    const avgCtx = document.getElementById('averageChart') as HTMLCanvasElement;
    if (avgCtx) {
      console.log('Creating average chart...');
      new Chart(avgCtx, {
        type: 'bar',
        data: {
          labels: this.stats.averages.map(a => a.questionText),
          datasets: [{
            label: 'Average Rating',
            data: this.stats.averages.map(a => a.average),
            backgroundColor: '#5A32A3',
            borderColor: '#4A2783',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              title: {
                display: true,
                text: 'Average Score (1-5)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Questions'
              }
            }
          },
          plugins: {
            legend: { display: false },
            title: { 
              display: true, 
              text: 'Average Ratings per Question',
              font: { size: 16, family: 'Poppins', weight: 600 },
              color: '#000000'
            }
          }
        }
      });
    } else {
      console.error('Canvas element with ID "averageChart" not found.');
    }

    this.stats.distributions.forEach((dist, index) => {
      const ctx = document.getElementById(`distChart${index}`) as HTMLCanvasElement;
      if (ctx) {
        console.log(`Creating distribution chart ${index}...`);
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: Object.keys(dist.options),
            datasets: [{
              label: 'Responses',
              data: Object.values(dist.options),
              backgroundColor: ['#5A32A3', '#FF69B4', '#E6F0FA'],
            }]
          },
          options: {
            plugins: {
              legend: { 
                display: true,
                position: 'right',
                labels: {
                  font: { family: 'Poppins', size: 14 }
                }
              },
              title: { 
                display: true, 
                text: dist.questionText,
                font: { size: 16, family: 'Poppins', weight: 600 },
                color: '#000000'
              }
            }
          }
        });
      } else {
        console.error(`Canvas element with ID "distChart${index}" not found.`);
      }
    });
  }

  async generateReport(): Promise<void> {
    if (!this.survey) return;

    const doc = new jsPDF();
    let yPosition = 20;

    doc.setFontSize(18);
    doc.setTextColor(90, 50, 163);
    doc.text(`Survey Report: ${this.survey.Title}`, 20, yPosition);
    yPosition += 10;

    doc.setLineWidth(0.5);
    doc.setDrawColor(90, 50, 163);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Survey Statistics', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(12);
    doc.text(`Total Responses: ${this.stats.totalResponses}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Participation Rate: ${this.stats.participationRate.toFixed(2)}%`, 20, yPosition);
    yPosition += 10;

    if (this.stats.averages.length > 0) {
      doc.setFontSize(12);
      doc.text('Average Ratings:', 20, yPosition);
      yPosition += 6;

      this.stats.averages.forEach(avg => {
        doc.setFontSize(10);
        doc.text(`${avg.questionText}: ${avg.average.toFixed(2)} / 5`, 30, yPosition);
        yPosition += 6;
      });

      const avgCanvas = document.getElementById('averageChart') as HTMLCanvasElement;
      if (avgCanvas) {
        try {
          const canvasImage = await html2canvas(avgCanvas, { scale: 2 });
          const imgData = canvasImage.toDataURL('image/png');
          const imgWidth = 100;
          const imgHeight = (canvasImage.height * imgWidth) / canvasImage.width;
          doc.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 10;
        } catch (error) {
          console.error('Error capturing average chart:', error);
        }
      } else {
        console.error('Average chart canvas not found.');
        doc.setFontSize(10);
        doc.setTextColor(255, 0, 0);
        doc.text('Error: Average Ratings chart could not be generated.', 20, yPosition);
        yPosition += 6;
      }
      yPosition += 4;
    }

    if (this.stats.distributions.length > 0) {
      doc.setFontSize(12);
      doc.text('Answer Distributions:', 20, yPosition);
      yPosition += 6;

      for (let i = 0; i < this.stats.distributions.length; i++) {
        const dist = this.stats.distributions[i];
        doc.setFontSize(10);
        doc.text(`${dist.questionText}:`, 30, yPosition);
        yPosition += 6;

        Object.entries(dist.options).forEach(([option, count]) => {
          doc.text(`${option}: ${count} response${count !== 1 ? 's' : ''}`, 40, yPosition);
          yPosition += 6;
        });

        const distCanvas = document.getElementById(`distChart${i}`) as HTMLCanvasElement;
        if (distCanvas) {
          try {
            const canvasImage = await html2canvas(distCanvas, { scale: 2 });
            const imgData = canvasImage.toDataURL('image/png');
            const imgWidth = 80;
            const imgHeight = (canvasImage.height * imgWidth) / canvasImage.width;
            doc.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
          } catch (error) {
            console.error(`Error capturing distribution chart ${i}:`, error);
          }
        } else {
          console.error(`Distribution chart ${i} canvas not found.`);
          doc.setFontSize(10);
          doc.setTextColor(255, 0, 0);
          doc.text(`Error: Distribution chart for "${dist.questionText}" could not be generated.`, 20, yPosition);
          yPosition += 6;
        }
        yPosition += 4;

        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      }
    }

    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Individual Responses', 20, yPosition);
    yPosition += 8;

    this.groupedResponses.forEach(group => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.text(`Employee: ${group.employeeName}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Response Date: ${new Date(group.respondedAt).toLocaleString()}`, 20, yPosition);
      yPosition += 6;

      group.answers.forEach(answer => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(10);
        doc.text(`Question: ${answer.questionText}`, 30, yPosition);
        yPosition += 5;
        const splitAnswer = doc.splitTextToSize(`Answer: ${answer.answer}`, 150);
        doc.text(splitAnswer, 30, yPosition);
        yPosition += splitAnswer.length * 5 + 2;
      });
      yPosition += 4;
    });

    doc.save(`Survey_Report_${this.survey.Title}.pdf`);
  }

  getQuestionText(questionId: string): string | undefined {
    if (!this.survey || !this.survey.Questions) return undefined;
    const question = this.survey.Questions.find(q => q.Id === questionId);
    return question ? question.Text : undefined;
  }

  goBack(): void {
    this.router.navigate(['/survey-list']);
  }

  logout(): void {
    this.loginService.logout();
    this.tokenService.clear();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}