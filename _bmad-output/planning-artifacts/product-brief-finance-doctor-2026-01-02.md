---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
date: 2026-01-02
author: Andres
---

# Product Brief: finance-doctor

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

finance-doctor is a personal finance tracking and guidance tool designed to bring clarity and control to monthly spending. Built as a privacy-first web application, it addresses the core frustration of not knowing where money goes each month by combining simple manual expense tracking with intelligent monthly insights and recommendations. Unlike existing finance apps that are either too complex or merely track without guidance, finance-doctor provides clear data visualization and actionable advice to help achieve long-term financial goals while keeping all sensitive data local and private.

---

## Core Vision

### Problem Statement

Personal finance management suffers from a critical visibility gap: most people spend money throughout the month without any systematic tracking, leading to uncertainty about where their money actually goes. This lack of financial awareness creates stress and significantly delays progress toward long-term financial goals.

### Problem Impact

Without proper expense tracking and guidance:
- Monthly spending patterns remain invisible until it's too late to course-correct
- Financial stress accumulates from not understanding where money is going
- Long-term savings goals and major purchases take significantly longer to achieve
- Decision-making happens in the dark without data to guide better choices

### Why Existing Solutions Fall Short

Current finance tracking applications fail in three critical ways:

1. **Privacy concerns**: They require sharing sensitive financial data with third-party services
2. **Unnecessary complexity**: They're convoluted with features that get in the way of simple tracking
3. **Passive tracking only**: They show where money went but provide no actionable guidance on how to improve

Additionally, in many countries bank API integrations aren't available, forcing manual entry anyway while still requiring data sharing with external services.

### Proposed Solution

finance-doctor is a privacy-first web application that enables:

- **Real-time expense tracking**: Quick manual entry of expenses as they occur, with categories, tags, and notes
- **Continuous visibility**: View monthly expenses at any time to course-correct spending before month-end
- **Intelligent monthly reviews**: Automated reports that clearly show spending patterns and provide actionable recommendations for improvement
- **Complete privacy**: All financial data stays local - no third-party data sharing or external service dependencies

### Key Differentiators

- **Privacy-first architecture**: Local data storage with no external sharing - financial data never leaves the user's control
- **Clarity over complexity**: Simple, clear data presentation without overwhelming features or convoluted interfaces
- **Actionable guidance**: Goes beyond tracking to provide meaningful recommendations for spending improvement
- **Purpose-built for manual entry**: Designed for the reality of manual tracking rather than treating it as a fallback option

## Target Users

### Primary Users

**Household Finance Managers (Andres & Partner)**

The primary users are household members who share financial responsibility and want visibility into their combined spending patterns. They make a mix of physical and online purchases throughout the day and need a frictionless way to track expenses in real-time without interrupting their daily activities.

**User Context:**
- Shared household finances with equal access and visibility
- Mix of in-person and online purchases across various categories
- Need for real-time expense logging without switching apps or breaking flow
- End-of-month financial stress from not knowing where money went

**Current Pain Points:**
- No systematic tracking leading to end-of-month surprises
- Existing finance apps require too much friction for quick expense entry
- Privacy concerns with third-party financial data sharing
- Lack of actionable guidance beyond passive tracking

**Success Vision:**
After the first month of usage, they can see clear spending patterns by category, understand where their money actually goes, and make informed decisions to course-correct before month-end. The end-of-month surprise is eliminated, replaced with confidence and control.

### Secondary Users

N/A - This is a focused household finance tool with no secondary user segments required at this stage.

### User Journey

**Discovery & Onboarding:**
Users set up finance-doctor by defining their spending categories and entering their household income. This establishes the baseline for tracking and provides context for future recommendations.

**Daily Usage - Expense Entry:**
When a purchase occurs (coffee, lunch, groceries, online shopping), users pull out their phone and send a quick message to the Telegram bot:
- "Coffee $5 dining"
- "Groceries $87.50 food"
- Bot parses the message, confirms the entry, done

The Telegram bot provides zero-friction expense logging that fits naturally into their mobile-first lifestyle without requiring app switching or complex forms.

**Mid-Month Check-In:**
Users open the web app to view spending by category, seeing real-time visibility into their current month's patterns. This allows for course correction before month-end if they're overspending in any area.

**Month-End Review:**
At the end of each month, users access the web app to review:
- **Charts and trends:** Visual representation of spending patterns across categories
- **Month-over-month comparisons:** How current spending compares to previous months
- **Actionable recommendations:** Specific guidance on where to reduce spending to meet financial goals

**Success Moment:**
The first month-end review where they see exactly where their money went, understand their spending patterns, and realize they have the visibility to make better decisions. No more surprise, no more financial stress from uncertainty.

**Long-Term Usage:**
finance-doctor becomes an automatic habit - expenses logged via Telegram throughout the day, periodic web app check-ins to monitor progress, monthly reviews to optimize spending. The tool becomes their financial clarity system.

## Success Metrics

### User Success Metrics

Success for finance-doctor is measured by whether it solves the core problem of financial visibility and control:

1. **First Month Completion** - Successfully tracking expenses for an entire month and completing the month-end review. This is the "aha moment" where users see exactly where their money went for the first time.

2. **End-of-Month Surprise Eliminated** - By months 2-3, the shock of "where did all my money go?" is replaced with clear understanding and confidence. Users know where their money went because they tracked it systematically.

3. **Real-Time Tracking Habit** - Consistent logging of expenses as they happen via Telegram bot, not batch-entering at end of week or month. This indicates the tool has become part of daily routine.

4. **Course-Correction Behavior** - Users check mid-month spending by category and actually adjust behavior when overspending (e.g., "I'm over on dining, let me cook more this week"). This shows the tool is enabling proactive financial management.

5. **Actionable Insights Used** - Monthly recommendations lead to actual changes in spending patterns, demonstrating that the guidance feature is creating real value beyond passive tracking.

### Personal Goals

As a personal tool, success is defined by life impact rather than business metrics:

- **Reduced financial stress and anxiety** - No more uncertainty about where money is going
- **Faster progress toward long-term financial goals** - Savings, big purchases, and financial milestones achieved more quickly through informed spending decisions
- **Sustainable expense tracking habit** - The system sticks long-term and doesn't become abandoned like previous attempts
- **Shared household financial clarity** - Both household members understand spending patterns and can make informed decisions together

### Key Performance Indicators

Specific, measurable indicators that track success:

- **Entry Consistency:** 90%+ of expenses actually logged (vs. estimated total household spending)
- **Time to Log:** Under 10 seconds to enter an expense via Telegram bot (ensuring frictionless experience)
- **Review Frequency:** Mid-month check-ins and month-end reviews completed consistently every month
- **Spending Pattern Improvement:** Month-over-month reduction in problem categories identified through recommendations

## MVP Scope

### Core Features

The MVP focuses on solving the core problem: eliminating end-of-month financial surprise through simple tracking and clear visualization.

**1. Telegram Bot Expense Entry**
- Quick text-based expense logging via Telegram
- Simple format parsing: "Coffee $5 dining" or "Groceries $87.50 food"
- Bot parses and stores: amount, category, date, description
- Immediate confirmation message
- Zero-friction entry that fits into daily mobile usage

**2. Category Management System**
- Define spending categories during initial onboarding
- Required for all expense entries
- Editable via web app for adding/modifying categories
- Categories form the foundation for spending analysis

**3. Web Dashboard - Basic Visualization**
- **Current month view:** All expenses for the current month
- **Spending by category:** Chart or table showing breakdown of spending across categories
- **Expense list:** Recent expenses with date, description, amount, and category
- **Total spent:** Clear display of total monthly spending
- Real-time visibility for mid-month course correction

**4. Month-End Summary Report**
- Simple spending breakdown by category
- Basic insights: percentage of total spending per category
- Clear presentation of where money went throughout the month
- Delivers the core value: no more end-of-month surprise

### Out of Scope for MVP

The following features are valuable but explicitly deferred to post-MVP iterations:

- **Advanced recommendations:** AI-powered spending suggestions and coaching
- **Historical analysis:** Month-over-month comparisons, trend charts, and historical data visualization
- **Tags and notes:** Additional metadata beyond categories
- **Budget targets:** Per-category budget limits and alerts
- **Expense management:** Edit and delete functionality for recorded expenses
- **Data export:** CSV/Excel export capabilities
- **Income tracking:** Income recording and forecasting features
- **Multi-user authentication:** Individual user accounts (shared login sufficient for MVP)

These features will be prioritized based on MVP success and user feedback.

### MVP Success Criteria

The MVP will be considered successful when:

1. **Daily usage habit established** - Both household members consistently log expenses via Telegram as they occur
2. **First month completion** - Successfully tracking expenses for an entire month with regular entries
3. **"Aha moment" achieved** - Month-end review eliminates the surprise of "where did my money go" and provides clear spending visibility
4. **Feature validation** - Users naturally desire additional capabilities (budgets, trends, recommendations), validating the roadmap for v2

Success validates moving forward with implementing deferred features.

### Future Vision

Upon successful MVP validation, finance-doctor will expand to include the deferred features:

- **Advanced AI-powered recommendations** for spending optimization
- **Budget targets and alerts** for proactive spending management
- **Historical analysis and trends** showing spending patterns over time
- **Enhanced categorization** with tags, notes, and automatic suggestions
- **Expense management** including edit, delete, and bulk operations
- **Data export and reporting** for external analysis
- **Multi-user features** with individual profiles and shared household views

The future vision maintains the core principles of privacy-first architecture, simplicity, and actionable guidance while expanding capabilities based on proven user value.
