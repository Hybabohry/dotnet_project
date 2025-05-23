import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-condidates',
  imports: [CommonModule, FormsModule],
  templateUrl: './condidates.component.html',
  styleUrls: ['./condidates.component.css']
})
export class CondidatesComponent {

  relevanceScore: number = 0;

  
  candidates = [
    {
      name: 'Jean Dupont',
      jobTitle: 'Développeur Frontend',
      experience: '3 ans',
      skills: 'HTML, CSS, JavaScript, React',
      score: 85
    },
    {
      name: 'Marie Martin',
      jobTitle: 'Développeur Backend',
      experience: '5 ans',
      skills: 'Node.js, Express, MongoDB',
      score: 75
    },
    {
      name: 'Paul Lefevre',
      jobTitle: 'Analyste de données',
      experience: '4 ans',
      skills: 'SQL, Python, Machine Learning',
      score: 90
    }
  ];

  filteredCandidates = this.candidates;

  // Filter and sort candidates by relevance score
  filterCandidates() {
    this.filteredCandidates = this.candidates
      .filter(candidate => candidate.score >= this.relevanceScore)
      .sort((a, b) => b.score - a.score);  // Sorting in descending order
  }
}
