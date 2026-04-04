import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import './helixis.css';
import BrowserThemeProvider from './../Theme';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const workflows = [
  {
    id: 'morning-brief',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
    title: 'Morning Brief',
    description: 'AI summary of overnight updates, emails, and priorities',
    color: '#f59e0b',
  },
  {
    id: 'checklist',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    title: "Today's Checklist",
    description: 'Auto-generated task list from your calendar and inbox',
    color: '#22c55e',
  },
  {
    id: 'inbox-triage',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
      </svg>
    ),
    title: 'Inbox Triage',
    description: 'Sort and prioritize unread messages with AI assistance',
    color: '#3b82f6',
  },
  {
    id: 'calendar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: 'Calendar Game Plan',
    description: 'Review today\'s schedule and prep for upcoming meetings',
    color: '#8b5cf6',
  },
  {
    id: 'buildium',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Buildium Queue',
    description: 'Open work orders, pending approvals, and tenant requests',
    color: '#ec4899',
  },
  {
    id: 'leasing',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="8.5" cy="7" r="4" />
        <line x1="20" y1="8" x2="20" y2="14" />
        <line x1="23" y1="11" x2="17" y2="11" />
      </svg>
    ),
    title: 'Leasing Pipeline',
    description: 'Track prospects, applications, and follow-up actions',
    color: '#06b6d4',
  },
  {
    id: 'maintenance',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: 'Maintenance Snapshot',
    description: 'Active tickets, vendor updates, and escalations at a glance',
    color: '#f97316',
  },
  {
    id: 'custom',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    title: 'Custom Workflow',
    description: 'Build your own AI workflow for any recurring task',
    color: '#a78bfa',
  },
];

export default function HelixisNewTab() {
  const [greeting] = useState(getGreeting);
  const [formattedDate] = useState(getFormattedDate);

  useEffect(() => {
    document.title = 'Helixis';
  }, []);

  return (
    <BrowserThemeProvider>
      <CssBaseline />
      <div className="helixis-ntp">
        <div className="helixis-bg-glow" />
        <div className="helixis-bg-grid" />

        {/* Top bar */}
        <header className="helixis-topbar">
          <div className="helixis-topbar-left">
            <span className="helixis-wordmark">Helixis</span>
            <span className="helixis-divider" />
            <span className="helixis-chip">AI Workspace</span>
          </div>
          <div className="helixis-topbar-right">
            <span className="helixis-status-dot" />
            <span className="helixis-status-text">Ready</span>
          </div>
        </header>

        <main className="helixis-main">
          {/* Greeting + Date */}
          <section className="helixis-greeting">
            <h1 className="helixis-greeting-text">{greeting}</h1>
            <p className="helixis-date">{formattedDate}</p>
          </section>

          {/* Omnibox */}
          <section className="helixis-omnibox-section">
            <div className="helixis-omnibox">
              <svg className="helixis-omnibox-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search, navigate, or start a workflow..."
                aria-label="Search or type a URL"
                className="helixis-omnibox-input"
              />
              <div className="helixis-omnibox-hint">
                <kbd>/</kbd>
              </div>
            </div>
          </section>

          {/* Workflow cards */}
          <section className="helixis-workflows">
            <div className="helixis-workflows-header">
              <h2 className="helixis-workflows-title">Start a workflow</h2>
              <p className="helixis-workflows-subtitle">AI-powered actions to launch your day</p>
            </div>

            <div className="helixis-workflows-grid">
              {workflows.map((w) => (
                <button
                  key={w.id}
                  className="helixis-wf-card"
                  style={{ '--wf-accent': w.color }}
                  type="button"
                >
                  <div className="helixis-wf-icon">
                    {w.icon}
                  </div>
                  <div className="helixis-wf-body">
                    <span className="helixis-wf-title">{w.title}</span>
                    <span className="helixis-wf-desc">{w.description}</span>
                  </div>
                  <svg className="helixis-wf-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          </section>

          {/* Focus strip */}
          <section className="helixis-focus-strip">
            <div className="helixis-focus-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z" />
              </svg>
              <span>3 connected apps</span>
            </div>
            <span className="helixis-focus-sep" />
            <div className="helixis-focus-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span>5 automations active</span>
            </div>
            <span className="helixis-focus-sep" />
            <div className="helixis-focus-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>All systems operational</span>
            </div>
          </section>
        </main>

        <footer className="helixis-footer">
          <span>Helixis</span>
          <span className="helixis-footer-sep">&middot;</span>
          <span>AI-native browser workspace</span>
        </footer>
      </div>
    </BrowserThemeProvider>
  );
}
