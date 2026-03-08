export interface PrdTemplate {
  id: string;
  title: string;
  emoji: string;
  description: string;
  tags: string[];
  content: string;
}

export const PRD_TEMPLATES: PrdTemplate[] = [
  {
    id: "new-feature",
    title: "New Feature PRD",
    emoji: "\u2728",
    description: "Standard PRD for shipping a new user-facing feature. Covers problem, goals, requirements, and success metrics.",
    tags: ["Feature", "Standard"],
    content: `# Feature PRD: [Feature Name]

## 1. Overview
**Author:** [Your Name]
**Date:** [Date]
**Status:** Draft
**Stakeholders:** [Engineering Lead, Design Lead, Product Manager]

## 2. Problem Statement
Describe the problem this feature solves. Who is affected and how?

- What user pain point or business need does this address?
- What evidence do we have that this is a real problem? (data, user interviews, support tickets)
- What happens if we don't solve this?

## 3. Goals & Success Metrics
### Goals
- **Primary:** [e.g., Increase user activation rate by 15%]
- **Secondary:** [e.g., Reduce support tickets related to onboarding by 30%]

### Key Metrics
| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| [Metric 1] | [Baseline] | [Goal] | [Weeks] |
| [Metric 2] | [Baseline] | [Goal] | [Weeks] |

### Non-Goals
- [Explicitly list what this project will NOT do]

## 4. User Stories
- As a [user type], I want to [action] so that [benefit].
- As a [user type], I want to [action] so that [benefit].
- As a [user type], I want to [action] so that [benefit].

## 5. Proposed Solution
### High-Level Approach
Describe the solution at a high level. Why this approach over alternatives?

### Key User Flows
1. **Happy Path:** [Step-by-step flow]
2. **Edge Cases:** [List known edge cases and how they're handled]

### Wireframes / Mockups
[Link to designs or describe the UI]

## 6. Technical Considerations
- **Dependencies:** [APIs, services, or teams needed]
- **Constraints:** [Performance, security, accessibility requirements]
- **Data model changes:** [New tables, fields, or schema migrations]
- **Backward compatibility:** [Any breaking changes?]

## 7. Scope & Milestones
### Phase 1 (MVP)
- [ ] [Feature slice 1]
- [ ] [Feature slice 2]
- [ ] [Feature slice 3]

### Phase 2 (Enhancement)
- [ ] [Feature slice 4]
- [ ] [Feature slice 5]

### Out of Scope
- [Items explicitly deferred]

## 8. Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| [Risk 1] | High | Medium | [Mitigation] |
| [Risk 2] | Medium | Low | [Mitigation] |

## 9. Open Questions
- [ ] [Question 1]
- [ ] [Question 2]
- [ ] [Question 3]
`,
  },
  {
    id: "platform-migration",
    title: "Platform Migration PRD",
    emoji: "\uD83D\uDD04",
    description: "For migrating systems, databases, or infrastructure. Emphasizes rollback plans, data integrity, and phased rollout.",
    tags: ["Infrastructure", "Migration"],
    content: `# Migration PRD: [Migration Name]

## 1. Overview
**Author:** [Your Name]
**Date:** [Date]
**Status:** Draft
**Migration Type:** [Database / Service / Platform / Framework]

## 2. Context & Motivation
### Current State
Describe the current system/platform and its limitations.

- What technology or system is being migrated?
- Why is the current solution no longer adequate?
- What is the cost of inaction? (technical debt, scaling limits, maintenance burden)

### Target State
Describe what the world looks like after migration.

- What technology or system are we migrating to?
- What specific improvements does this unlock?

## 3. Goals & Success Criteria
### Goals
- **Primary:** [e.g., Reduce P99 latency from 800ms to 200ms]
- **Secondary:** [e.g., Reduce infrastructure costs by 40%]

### Success Criteria
- [ ] All data migrated with zero data loss
- [ ] Feature parity with current system
- [ ] Performance meets or exceeds current benchmarks
- [ ] Rollback successfully tested

### Non-Goals
- [What this migration will NOT change]

## 4. Migration Strategy
### Approach
[Big bang / Strangler fig / Blue-green / Parallel run]

Describe why this approach was chosen over alternatives.

### Data Migration Plan
1. **Schema mapping:** [Old schema] → [New schema]
2. **Data validation:** How will you verify data integrity?
3. **Backfill strategy:** How is historical data handled?

### Rollback Plan
- **Trigger criteria:** [What conditions trigger a rollback?]
- **Rollback steps:** [Step-by-step rollback procedure]
- **Data reconciliation:** [How to handle data written during migration]

## 5. Phased Rollout
### Phase 1: Shadow Mode
- Run new system in parallel, compare outputs
- Duration: [X weeks]
- Success gate: [Criteria to proceed]

### Phase 2: Canary (X% Traffic)
- Route [X]% of traffic to new system
- Duration: [X weeks]
- Success gate: [Criteria to proceed]

### Phase 3: Full Migration
- Route 100% of traffic
- Decommission old system after [X] weeks of stability

## 6. Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Data loss during migration | Critical | Low | Checksums + parallel writes |
| Performance regression | High | Medium | Shadow mode benchmarking |
| Feature gap discovered late | High | Medium | Feature parity checklist |
| Extended downtime | High | Low | Blue-green deployment |

## 7. Dependencies & Stakeholders
- **Teams involved:** [List all teams]
- **External dependencies:** [Third-party services, vendors]
- **Communication plan:** [How/when stakeholders are updated]

## 8. Timeline
| Phase | Start | End | Owner |
|-------|-------|-----|-------|
| Planning & Design | [Date] | [Date] | [Owner] |
| Shadow Mode | [Date] | [Date] | [Owner] |
| Canary Rollout | [Date] | [Date] | [Owner] |
| Full Migration | [Date] | [Date] | [Owner] |
| Old System Decommission | [Date] | [Date] | [Owner] |

## 9. Open Questions
- [ ] [Question 1]
- [ ] [Question 2]
`,
  },
  {
    id: "api-spec",
    title: "API Specification PRD",
    emoji: "\uD83D\uDD0C",
    description: "For new or updated APIs. Includes endpoint design, request/response schemas, auth, rate limits, and versioning.",
    tags: ["API", "Technical"],
    content: `# API PRD: [API Name]

## 1. Overview
**Author:** [Your Name]
**Date:** [Date]
**Status:** Draft
**API Type:** [REST / GraphQL / gRPC / WebSocket]
**Base URL:** \`/api/v1/[resource]\`

## 2. Problem Statement
What capability does this API enable? Who are the consumers?

- **Internal consumers:** [Services, frontend apps]
- **External consumers:** [Partners, third-party developers]
- **Use cases:** [List primary use cases]

## 3. Goals & Constraints
### Goals
- [e.g., Enable mobile app to manage user profiles]
- [e.g., Support 10,000 requests/second at P99 < 100ms]

### Constraints
- **Authentication:** [OAuth2 / API Key / JWT]
- **Rate limits:** [X requests per minute per client]
- **Payload limits:** [Max request/response size]
- **Backward compatibility:** [Versioning strategy]

## 4. Endpoint Design

### \`POST /api/v1/[resource]\`
**Description:** Create a new [resource].

**Request:**
\`\`\`json
{
  "name": "string (required)",
  "description": "string (optional)",
  "config": {
    "key": "value"
  }
}
\`\`\`

**Response (201 Created):**
\`\`\`json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "config": {},
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
\`\`\`

**Error Responses:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | INVALID_REQUEST | Request validation failed |
| 401 | UNAUTHORIZED | Missing or invalid credentials |
| 409 | CONFLICT | Resource already exists |
| 429 | RATE_LIMITED | Too many requests |

---

### \`GET /api/v1/[resource]/:id\`
**Description:** Retrieve a single [resource] by ID.

**Response (200 OK):**
\`\`\`json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "config": {},
  "created_at": "ISO 8601",
  "updated_at": "ISO 8601"
}
\`\`\`

---

### \`GET /api/v1/[resource]\`
**Description:** List [resources] with pagination.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | int | 1 | Page number |
| limit | int | 20 | Items per page (max 100) |
| sort | string | created_at | Sort field |
| order | string | desc | asc or desc |

**Response (200 OK):**
\`\`\`json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "has_more": true
  }
}
\`\`\`

---

### \`PUT /api/v1/[resource]/:id\`
**Description:** Update an existing [resource].

### \`DELETE /api/v1/[resource]/:id\`
**Description:** Delete a [resource]. Returns 204 No Content.

## 5. Authentication & Authorization
- **Auth method:** [Describe the auth mechanism]
- **Scopes / Permissions:** [List required permissions per endpoint]
- **API key management:** [How keys are issued, rotated, revoked]

## 6. Rate Limiting & Quotas
| Tier | Rate Limit | Burst | Daily Quota |
|------|-----------|-------|-------------|
| Free | 60/min | 10 | 1,000 |
| Pro | 600/min | 50 | 50,000 |
| Enterprise | Custom | Custom | Unlimited |

## 7. Versioning Strategy
- **Current version:** v1
- **Deprecation policy:** [X months notice before sunset]
- **Breaking change policy:** [What constitutes a breaking change]

## 8. Monitoring & Observability
- **Logging:** [What gets logged]
- **Metrics:** [Latency, error rates, throughput]
- **Alerting:** [Thresholds and notification channels]

## 9. Open Questions
- [ ] [Question 1]
- [ ] [Question 2]
`,
  },
  {
    id: "growth-experiment",
    title: "Growth Experiment PRD",
    emoji: "\uD83D\uDCC8",
    description: "For A/B tests and growth experiments. Includes hypothesis, variants, audience targeting, and statistical rigor.",
    tags: ["Growth", "Experiment"],
    content: `# Experiment PRD: [Experiment Name]

## 1. Overview
**Author:** [Your Name]
**Date:** [Date]
**Status:** Draft
**Experiment Type:** [A/B Test / Multivariate / Feature Flag]

## 2. Hypothesis
**If** we [change/action],
**then** [expected outcome],
**because** [reasoning based on data or insight].

### Supporting Evidence
- [Data point or user research finding 1]
- [Data point or user research finding 2]
- [Competitive analysis or industry benchmark]

## 3. Experiment Design
### Primary Metric
- **Metric:** [e.g., Conversion rate from signup to first action]
- **Current baseline:** [X%]
- **Minimum detectable effect (MDE):** [X% relative change]

### Secondary Metrics (Guardrails)
- [e.g., Page load time — must not increase by >200ms]
- [e.g., Support ticket volume — must not increase by >10%]

### Variants
| Variant | Description | Traffic % |
|---------|-------------|-----------|
| Control | Current experience | 50% |
| Treatment A | [Describe change] | 50% |

### Audience
- **Targeting:** [New users / Existing users / Segment]
- **Exclusions:** [Who is excluded and why]
- **Sample size needed:** [Calculate using MDE and baseline]
- **Expected duration:** [X weeks to reach significance]

## 4. Implementation Details
### Changes Required
- [ ] [Frontend change 1]
- [ ] [Backend change 2]
- [ ] [Tracking event 3]

### Feature Flags
- **Flag name:** \`experiment_[name]\`
- **Rollout tool:** [LaunchDarkly / Statsig / internal]

## 5. Analysis Plan
- **Statistical method:** [Frequentist / Bayesian]
- **Confidence level:** [95% / 90%]
- **Analysis tool:** [Amplitude / internal dashboard]
- **Decision criteria:**
  - Ship if: [primary metric improves by ≥X% at 95% confidence]
  - Iterate if: [directionally positive but not significant]
  - Kill if: [negative impact on primary or guardrail metrics]

## 6. Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Novelty effect inflates results | Medium | Run for minimum 2 full weeks |
| Sample contamination | High | Ensure proper randomization |
| Metric instrumentation error | High | Validate tracking in QA |

## 7. Timeline
| Phase | Date | Owner |
|-------|------|-------|
| Design & Build | [Date] | [Owner] |
| QA & Tracking Validation | [Date] | [Owner] |
| Launch Experiment | [Date] | [Owner] |
| Analysis & Decision | [Date] | [Owner] |

## 8. Open Questions
- [ ] [Question 1]
- [ ] [Question 2]
`,
  },
  {
    id: "bug-fix",
    title: "Bug Fix / Incident PRD",
    emoji: "\uD83D\uDC1B",
    description: "For critical bugs or post-incident fixes. Focuses on root cause, impact, fix approach, and prevention.",
    tags: ["Bug Fix", "Incident"],
    content: `# Bug Fix PRD: [Bug Title]

## 1. Overview
**Author:** [Your Name]
**Date:** [Date]
**Severity:** [P0 Critical / P1 High / P2 Medium / P3 Low]
**Status:** Draft
**Incident link:** [Link to incident report if applicable]

## 2. Problem Description
### What's Happening
Describe the bug clearly. What does the user see? What should they see instead?

### Impact
- **Users affected:** [Number or percentage]
- **Revenue impact:** [Estimated, if applicable]
- **Duration:** [How long has this been occurring?]
- **Escalation:** [Customer complaints, social media, etc.]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]
4. **Expected:** [What should happen]
5. **Actual:** [What actually happens]

## 3. Root Cause Analysis
### Root Cause
[Describe the technical root cause. What went wrong and why?]

### Contributing Factors
- [e.g., Missing input validation]
- [e.g., Race condition under high load]
- [e.g., Untested edge case in recent deploy]

### Timeline
| Time | Event |
|------|-------|
| [Time] | Bug introduced (commit/deploy) |
| [Time] | First user report |
| [Time] | Issue identified |
| [Time] | Fix deployed |

## 4. Proposed Fix
### Approach
Describe the fix at a high level.

### Changes Required
- [ ] [Code change 1]
- [ ] [Code change 2]
- [ ] [Test addition]

### Alternatives Considered
| Approach | Pros | Cons |
|----------|------|------|
| [Approach 1] | [Pros] | [Cons] |
| [Approach 2] | [Pros] | [Cons] |

## 5. Testing Plan
- [ ] Unit tests covering the specific bug scenario
- [ ] Integration test for the affected flow
- [ ] Manual QA verification
- [ ] Load test (if performance-related)

## 6. Prevention
What will we do to prevent similar issues in the future?

- [ ] [e.g., Add input validation at the API boundary]
- [ ] [e.g., Add monitoring alert for error rate spike]
- [ ] [e.g., Update code review checklist]
- [ ] [e.g., Add regression test to CI pipeline]

## 7. Open Questions
- [ ] [Question 1]
- [ ] [Question 2]
`,
  },
  {
    id: "mobile-feature",
    title: "Mobile Feature PRD",
    emoji: "\uD83D\uDCF1",
    description: "For mobile app features. Covers platform differences, offline support, app store requirements, and device constraints.",
    tags: ["Mobile", "Feature"],
    content: `# Mobile PRD: [Feature Name]

## 1. Overview
**Author:** [Your Name]
**Date:** [Date]
**Status:** Draft
**Platforms:** [iOS / Android / Both]
**Min OS Version:** [iOS X+ / Android X+]

## 2. Problem Statement
Describe the mobile-specific problem this feature solves.

- What is the user pain point on mobile specifically?
- How does this differ from the web experience (if applicable)?
- What mobile-specific constraints or opportunities exist?

## 3. Goals & Metrics
### Goals
- **Primary:** [e.g., Increase mobile DAU by 20%]
- **Secondary:** [e.g., Improve app store rating from 3.8 to 4.2]

### Key Metrics
| Metric | Current | Target |
|--------|---------|--------|
| [Metric 1] | [Baseline] | [Goal] |
| [Metric 2] | [Baseline] | [Goal] |

## 4. User Stories
- As a mobile user, I want to [action] so that [benefit].
- As a mobile user, I want to [action] so that [benefit].

## 5. Design & UX
### Screen Flows
[Link to Figma / design file]

### Platform-Specific Considerations
| Aspect | iOS | Android |
|--------|-----|---------|
| Navigation | [Pattern] | [Pattern] |
| Gestures | [Specific gestures] | [Specific gestures] |
| Notifications | [APNs approach] | [FCM approach] |

### Accessibility
- [ ] VoiceOver / TalkBack support
- [ ] Dynamic type / font scaling
- [ ] Minimum touch target 44pt / 48dp
- [ ] Color contrast meets WCAG AA

### Offline Behavior
- What happens when the user is offline?
- What data is cached locally?
- How are offline actions synced when connectivity returns?

## 6. Technical Considerations
- **Architecture:** [Native / React Native / Flutter]
- **Local storage:** [Core Data / Room / SQLite]
- **API requirements:** [New endpoints or changes needed]
- **Push notifications:** [Triggers and payload design]
- **Deep linking:** [URL scheme / Universal links]
- **Background processing:** [Any background tasks needed?]

## 7. Device & Performance
- **Target devices:** [List specific device tiers]
- **Performance budget:**
  - App launch: < [X] seconds
  - Screen transition: < [X]ms
  - Memory usage: < [X]MB
- **Battery impact:** [Acceptable drain for background tasks]

## 8. App Store Requirements
- [ ] App Store / Play Store guideline compliance
- [ ] Privacy nutrition labels / Data safety section
- [ ] Required permissions and justifications
- [ ] In-app purchase requirements (if applicable)

## 9. Rollout Plan
### Phase 1: Beta
- TestFlight / Internal testing track
- [X] beta testers

### Phase 2: Staged Rollout
- [X]% → [X]% → 100% over [X] days

## 10. Open Questions
- [ ] [Question 1]
- [ ] [Question 2]
`,
  },
];
