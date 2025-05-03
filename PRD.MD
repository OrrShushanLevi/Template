Product Requirements Document: Flomy MVP (Web Application)
Version: 1.0
Date: May 3, 2025
Status: Draft
1. Introduction & Goals
1.1 Overview: Flomy is a web application designed to simplify personal bill management for users. By uploading an image or PDF of a bill (e.g., utility bill, invoice), Flomy leverages Optical Character Recognition (OCR) to automatically extract key information – specifically the payment amount and due date. This information is then organized and presented in a user-friendly dashboard, helping users track upcoming payments and avoid late fees.
1.2 Objectives:
Eliminate manual data entry for tracking bills.
Provide a centralized view of upcoming payment obligations.
Reduce the likelihood of missed payments through clear visibility and timely reminders (visual cues in MVP).
Offer a simple, fast, and intuitive user experience for bill management.
1.3 Success Metrics (MVP):
Adoption: Number of registered users actively uploading bills within the first month post-launch.
Core Task Completion Rate: Percentage of successful bill uploads that result in saved payment records (including user confirmation/correction). Target: >85%.
OCR Accuracy: Percentage of bills where amount and date are correctly extracted requiring no user correction (internal metric). Target: >70% (acknowledging variability).
User Engagement: Average number of bills uploaded per active user per month. Percentage of upcoming bills marked as "Paid" by users.
1.4 Target Audience:
Primary: Individuals in Israel (based on inferred context like currency format "₪", "ש"ח") who manage household or personal bills and seek a simpler way to organize and track payment due dates.
Personas (Derived):
The Busy Professional: Juggles multiple responsibilities, values time-saving tools, prone to forgetting occasional bill payments.
The Budget-Conscious Organizer: Actively tracks expenses, seeks clarity on upcoming outflows, appreciates tools that aid financial planning.
The Digitally-Minded User: Prefers digital solutions over paper, comfortable using web applications for various tasks.
2. Functional Requirements (Features - MVP)
FR-001: User Authentication (Leveraging Existing Stack)
User Story: As a user, I want to securely sign up and sign in to Flomy, so that my bill information is private and associated with my account.
Acceptance Criteria:
Utilize the existing Clerk integration for user registration and login flows.
Support standard sign-up/sign-in methods configured in Clerk (e.g., email/password, social logins).
Ensure all other functionalities (bill upload, viewing dashboard) require an authenticated session.
Leverage Clerk components (<SignIn>, <SignUp>, <UserButton>) within the Next.js application structure (src/app/(auth)/, layout).
FR-002: Bill Upload
User Story: As an authenticated user, I want to upload an image (JPG, PNG) or a PDF document representing a bill, so the system can analyze it.
Acceptance Criteria:
A clear "Add New Bill" (or similar) button/element is present on the main dashboard.
Clicking the button triggers a standard browser file input dialog.
The file input accepts files with .jpg, .jpeg, .png, and .pdf extensions.
Implement a reasonable file size limit (e.g., 10MB) with clear error feedback if exceeded.
Provide visual feedback during the upload process (e.g., loading spinner/progress indicator using shadcn/ui components).
Display user-friendly error messages for failed uploads (e.g., network error, invalid file type, size exceeded).
(Stretch Goal for MVP/Future): Investigate using browser Media Capture APIs (<input type="file" accept="image/*" capture="environment">) to allow direct photo capture on mobile devices accessing the web app, though file selection is the primary MVP method.
FR-003: Automated Bill Analysis (OCR & Extraction)
User Story: As a user, after uploading a bill image/PDF, I want the system to automatically identify the total amount due, the final payment date, and potentially the supplier/issuer name, so I don't have to type them manually.
Acceptance Criteria:
Upon successful upload, the backend triggers an OCR process using a designated service (e.g., Google Cloud Vision API).
The backend processes the OCR text result using Regular Expressions (Regex) and potentially simple heuristics tailored for common Israeli bill formats to find:
Payment Amount (looking for patterns like ₪123.45, 123.45 ש"ח, etc.).
Due Date (looking for DD/MM/YYYY, DD.MM.YYYY, MM/YYYY formats, potentially keywords like "לתשלום עד").
Supplier Name (Best-effort extraction based on common locations/logos - lower priority for MVP accuracy).
The system must handle cases where multiple potential amounts or dates are found (e.g., select the largest amount, the latest date, or prompt user).
The system must handle cases where required information (amount/date) is not found by the automated process.
FR-004: Data Confirmation & Correction
User Story: As a user, after the system analyzes the bill, I want to review the automatically extracted amount and due date, correct them if necessary, and confirm them before saving.
Acceptance Criteria:
After backend processing, the user is presented with a confirmation view/modal (using shadcn/ui Dialog/Card).
This view displays the uploaded bill image/preview alongside input fields (shadcn/ui Input) pre-filled with the extracted:
Payment Amount (editable, numeric input validation).
Due Date (editable, using shadcn/ui Date Picker).
Supplier Name (editable, optional text input).
If data extraction failed for a required field (Amount, Due Date), the corresponding input field is shown empty, prompting manual entry.
Clear visual cues indicate which fields were automatically extracted vs. requiring manual input.
User must be able to easily modify the content of each field.
A "Save" or "Confirm" button is present.
A "Cancel" button allows discarding the upload and analysis.
FR-005: Store Payment Record
User Story: As a user, once I confirm the bill details, I want the system to save this information, so I can track it as an upcoming payment.
Acceptance Criteria:
Clicking "Save/Confirm" on the confirmation view triggers saving the data to the MongoDB database.
A Payments collection record is created, associated with the userId (from Clerk).
The record includes: userId, amount (Number), dueDate (Date), supplierName (String, optional), status (String, default: "Unpaid"), originalFileName (String), storageFileRef (String - identifier/URL for the stored file), createdAt (Timestamp), updatedAt (Timestamp).
The uploaded file itself is persisted securely (e.g., in AWS S3, Google Cloud Storage, or MongoDB GridFS - See Tech Arch).
Upon successful save, the user is redirected to the main dashboard, potentially with a success notification (shadcn/ui Toast).
The newly added payment appears on the dashboard.
FR-006: Dashboard Display (Upcoming Payments)
User Story: As an authenticated user, I want to see a clear, prioritized list of my upcoming (unpaid) bills on my main dashboard, so I know what needs attention.
Acceptance Criteria:
The main view after login (/dashboard).
Displays a list or card layout (using shadcn/ui Card/Table) of payment records where status is "Unpaid".
Each payment entry shows: supplierName (or a placeholder like "Bill"), amount, dueDate.
Calculate and display "Days Remaining" until dueDate (relative to the current date).
Payments must be sorted by dueDate in ascending order (nearest due date first).
Provide controls for each payment: "Mark as Paid", "Edit", "Delete".
Display a summary field showing the "Total Amount Due This Month" (sum of amount for unpaid bills with dueDate within the current calendar month).
Visually highlight payments due within a defined short timeframe (e.g., dueDate is within the next 3 days - potentially using color or an icon).
Display a clear message (empty state) when the user has no upcoming payments.
FR-007: Manage Payment Status & Actions
User Story: As a user, I want to mark a bill as "Paid" once I've handled it, and I also want to be able to edit or delete saved bill records if needed.
Acceptance Criteria:
Mark as Paid:
A button/action labeled "Mark as Paid" is available for each "Unpaid" payment on the dashboard.
Clicking this updates the payment record's status to "Paid" in the database.
Paid items are removed from the default "Upcoming Payments" list on the dashboard.
The "Total Amount Due This Month" summary recalculates accordingly.
Edit:
An "Edit" button/action is available for each payment.
Clicking it likely opens a modal/view similar to the Confirmation View (FR-004), pre-filled with the existing data, allowing modification of Amount, Due Date, Supplier Name.
Saving updates the existing payment record.
Delete:
A "Delete" button/action is available for each payment.
Requires a confirmation step (e.g., shadcn/ui AlertDialog) before proceeding.
Confirmed deletion removes the payment record from the database. Associated stored file may also be deleted (TBD - see Open Questions).
3. Non-Functional Requirements
NFR-001: Scalability:
The architecture (Next.js on Node.js, MongoDB) should support an initial load of hundreds of concurrent users and potentially thousands of stored bills per user.
Stateless API routes should be used to allow horizontal scaling of the backend compute (if deployed on platforms like Vercel/Netlify).
MongoDB Atlas cluster size should be chosen appropriately (can start small and scale).
OCR service usage must consider potential rate limits and associated costs as user base grows.
File storage solution must scale to accommodate numerous uploaded files.
NFR-002: Performance:
Web application pages (Dashboard) should load in under 3 seconds on a standard broadband connection.
API response times for dashboard data fetching < 500ms.
Bill upload time depends on connection speed, but server-side processing (OCR + extraction) should ideally complete within 10-15 seconds. Provide asynchronous feedback to the user during this time.
Database queries must be optimized (e.g., indexing on userId, dueDate, status).
NFR-003: Security:
Authentication and Authorization strictly handled by Clerk. API routes must validate user identity and ensure users can only access/modify their own payment data.
Protect against common web vulnerabilities (XSS, CSRF, Injection) through Next.js features, proper input validation/sanitization, and secure coding practices.
Securely store sensitive credentials (API keys for OCR, DB connection string, Clerk secrets) using environment variables (.env.local).
Use HTTPS for all communication.
Implement access controls on the file storage solution to ensure only the owning user (or the application on their behalf) can access uploaded bill files.
NFR-004: Usability:
Interface should be clean, intuitive, and uncluttered (leverage shadcn/ui's design system).
Clear visual hierarchy and navigation.
Mobile-first responsive design is essential – the web app must be fully functional and look good on common phone/tablet screen sizes.
Provide clear feedback for all user actions (loading states, success messages, error messages - use Toasts, Spinners).
Ensure sufficient contrast and consider accessibility best practices (WCAG AA where feasible).
NFR-005: Maintainability & Reliability:
Codebase primarily in TypeScript with consistent coding standards (use ESLint/Prettier).
Leverage Next.js project structure conventions (app, components, lib, models).
Implement backend logging for API requests, key operations (OCR processing, DB writes), and errors.
Implement basic health checks if deploying to managed platforms.
Handle API (OCR, DB) errors gracefully, providing informative feedback to the user where appropriate and logging details for developers.
Aim for high test coverage, especially for backend logic (API routes, data extraction).
4. Edge Case & Exception Handling Analysis
Upload:
Invalid File Type: Reject upload, display error "Invalid file type. Please use JPG, PNG, or PDF."
File Size Exceeded: Reject upload, display error "File size exceeds the limit of [X] MB."
Network Error During Upload: Display error "Upload failed due to network issue. Please try again."
Storage Failure (Backend): Log error, display generic "Failed to save uploaded file. Please try again later."
OCR & Extraction:
Unreadable/Corrupted File: Log error, display "Could not read file. Please upload a clear image or valid PDF." on confirmation screen, requiring full manual entry.
OCR Service Error/Timeout: Log specific error, display "Could not analyze bill automatically. Please enter details manually." on confirmation screen.
No Amount/Date Found: Proceed to confirmation screen with relevant fields empty, prompting manual entry.
Multiple Conflicting Amounts/Dates: Apply defined heuristic (e.g., highest amount, latest date). Log the ambiguity. Allow user to correct on confirmation screen.
Very Low Confidence Score (if provided by OCR API): Pre-fill fields but potentially add a visual warning "Check extracted data carefully".
Non-Hebrew/Unsupported Format Bill: Extraction likely fails. User needs to enter manually on confirmation screen.
Data Confirmation/Saving:
User Enters Invalid Data (e.g., non-numeric amount, impossible date): Use form validation (client-side + server-side) to prevent saving, show inline error messages.
Database Write Failure: Log error, display "Failed to save payment details. Please try again." to the user. Prevent redirection.
User Tries to Save Without Required Fields: Form validation prevents submission.
Dashboard/Data Display:
No Payments Exist (New User): Display welcoming empty state message guiding user to "Add New Bill".
Large Number of Payments: Implement pagination or virtual scrolling on the dashboard list in a future iteration if performance degrades. MVP might handle moderate numbers (~50-100).
Database Read Failure: Log error, display error state on dashboard "Could not load payment data. Please refresh or try again later."
General:
User Session Expires (Clerk): Clerk's middleware/provider should handle redirecting to login automatically.
Browser Incompatibility: Test on latest versions of major browsers (Chrome, Firefox, Safari, Edge). Minor visual glitches may occur on older browsers.
Network Interruption During Use: Client-side state might become stale. Data fetching libraries (swr, react-query) can help with automatic refetching on reconnection/focus.
5. Technical Architecture & Library Recommendations (Based on Existing Stack)
5.1 Architecture: Monolithic Full-Stack Web Application using Next.js 14 App Router.
Server Components for primarily static display/data fetching where possible.
Client Components for interactive elements (forms, buttons, dashboard interactions).
Next.js API Routes (src/app/api/) for backend logic (handling uploads, OCR triggering, DB operations).
5.2 Core Stack (Given):
Framework: Next.js 14 (App Router) - Justification: Provides integrated frontend/backend development, routing, rendering strategies, and API capabilities required.
Language: TypeScript - Justification: Enhances code quality, maintainability, and reduces runtime errors.
UI Styling: TailwindCSS - Justification: Utility-first approach allows rapid development and easy customization.
UI Components: shadcn/ui - Justification: Provides accessible, composable, and customizable components fitting the Tailwind ecosystem.
Authentication: Clerk - Justification: Handles complex user management, session handling, and provides UI components out-of-the-box.
Database: MongoDB Atlas - Justification: Flexible schema suits evolving bill data, scales easily, integrates well with Node.js.
ODM: Mongoose (assumed, typical with MongoDB/Node.js) - Justification: Simplifies database interactions, provides schema validation.
5.3 Key Additional Libraries/Services:
OCR Service: Google Cloud Vision API - Justification: Recommended in original prompt, known for strong performance, especially with diverse documents. Requires @google-cloud/vision SDK.
File Storage: AWS S3 or Google Cloud Storage - Justification: Dedicated object storage is more robust and scalable for files than storing directly in DB (e.g., GridFS). Requires appropriate SDK (e.g., aws-sdk or @google-cloud/storage) and configuration.
Client-Side Data Fetching: SWR or React Query (TanStack Query) - Justification: Simplifies data fetching, caching, revalidation, and state management for API interactions from Client Components.
Date Formatting/Manipulation: date-fns or Day.js - Justification: Lightweight libraries for reliable date calculations (Days Remaining) and formatting.
5.4 Deployment: Platform like Vercel or Netlify recommended. Justification: Native support for Next.js, easy deployment, serverless function hosting for API routes, environment variable management.
6. Data Model Considerations (High-Level)
User: Primarily managed by Clerk (userId). No separate User collection needed in MongoDB for MVP unless storing specific app preferences later.
Payment: (MongoDB Collection: payments)
_id: ObjectId (auto-generated)
userId: String (indexed, reference to Clerk user ID)
amount: Number (indexed)
dueDate: Date (indexed)
supplierName: String (optional)
status: String (enum: "Unpaid", "Paid", indexed)
originalFileName: String
storageProvider: String (enum: "S3", "GCS", etc.)
storageFileRef: String (e.g., bucket path/key or URL)
ocrConfidence: { amount: Number, dueDate: Number } (optional, 0-1 scale)
createdAt: Date
updatedAt: Date
Relationships: One User (implicit via userId) relates to Many Payments.
7. Open Questions & Assumptions
7.1 Assumptions:
The application is a Web Application, accessible via browsers on desktop and mobile (not a native app).
Primary target users and bill formats are specific to Israel.
Google Cloud Vision API is the chosen and feasible OCR provider (budget/setup considered).
A cloud-based object storage (S3, GCS) is the preferred method for storing uploaded bill files.
MVP reminders are limited to visual indicators within the dashboard; external notifications (email, push) are out of scope for MVP.
Regex patterns for common Israeli bills will provide sufficient extraction accuracy for MVP.
User registration/login solely relies on the configured Clerk setup.
7.2 Open Questions:
What is the specific cloud storage provider to be used (S3, GCS)? Credentials need setup.
What is the exact file size limit for uploads?
Detailed requirements for the "Edit Payment" flow - which fields are truly editable after initial OCR? Can the image be replaced?
Clarify the exact calculation for "Total Amount Due This Month" (strict calendar month vs. rolling 30 days).
What is the policy on deleting stored bill files when a payment record is deleted? (Keep file, delete file?)
Are there specific data privacy regulations (beyond standard GDPR-like principles) in the target market that require specific consent mechanisms for file processing/storage?
How should the system handle bills with multiple pages (PDFs)? (Process first page only for MVP? Attempt all pages?)
Minimum confidence threshold from OCR below which the system should not pre-fill data?
Budget constraints for OCR API usage and Cloud Storage?