﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Back_HR.Models
{
    public class HRContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
    {
        public HRContext(DbContextOptions<HRContext> options) : base(options)
        {
        }

        // DbSets for all entities
        public new DbSet<User> Users { get; set; }
        public DbSet<Candidat> Candidates { get; set; }
        public DbSet<RH> HRs { get; set; }
        public DbSet<Competence> Competences { get; set; }
        public DbSet<JobOffer> JobOffers { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<RevokedToken> RevokedTokens { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Required for IdentityDbContext
            base.OnModelCreating(modelBuilder);

            // Configure TPT for User inheritance (separate tables for each type)
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Candidat>().ToTable("Candidates");
            modelBuilder.Entity<RH>().ToTable("HRs");


            // Configure GUID IDs with default values (NEWID for SQL Server)
            modelBuilder.Entity<User>().Property(u => u.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<Candidat>().Property(c => c.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<RH>().Property(r => r.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<Competence>().Property(s => s.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<JobOffer>().Property(j => j.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<Notification>().Property(n => n.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<Application>().Property(a => a.Id).HasDefaultValueSql("NEWID()");

            modelBuilder.Entity<User>()
                .Property(u => u.UserType)
                .HasConversion<int>();

            
        
            // Optional: Seed initial data for testing

            // Configure many-to-many between Candidate and Skill
            modelBuilder.Entity<Candidat>()
                .HasMany(c => c.Competences)
                .WithMany(s => s.Candidats)
                .UsingEntity(j => j.ToTable("CandidateSkills"));

            // Configure many-to-many between JobOffer and Skill
            modelBuilder.Entity<JobOffer>()
                .HasMany(j => j.Competences)
                .WithMany(s => s.JobOffres)
                .UsingEntity(j => j.ToTable("JobOfferSkills"));

            // Configure many-to-one between JobOffer and HR
            modelBuilder.Entity<JobOffer>()
                .HasOne(j => j.RHResponsable)
                .WithMany(r => r.Offres)
                .HasForeignKey(j => j.RHId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure many-to-many between Notification and User
            modelBuilder.Entity<Notification>()
                .HasMany(n => n.Users)
                .WithMany(u => u.Notifications)
                .UsingEntity(j => j.ToTable("NotificationUsers"));

            // Configure one-to-many between Candidate and Application
            modelBuilder.Entity<Candidat>()
                .HasMany(c => c.Applications)
                .WithOne(a => a.Candidat)
                .HasForeignKey(a => a.CandidateId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure one-to-many between JobOffer and Application
            modelBuilder.Entity<JobOffer>()
                .HasMany(j => j.Applications)
                .WithOne(a => a.JobOffer)
                .HasForeignKey(a => a.JobOfferId)
                .OnDelete(DeleteBehavior.Restrict);

            // Suppression de la conversion JSON pour Survey.Questions (remplacée par SurveyQuestion)
            // La conversion JSON pour SurveyResponse.Answers reste inchangée
            
    }
    }
}