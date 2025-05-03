# Flomy MVP Development Tasks

This document outlines the specific tasks required to transform the existing Next.js boilerplate project into the Flomy MVP application, based on the `PRD.MD` and the boilerplate's `README.md`.

---

## Phase 1: Setup & Boilerplate Cleanup

**TASK-00: Clean Boilerplate Branding and Content** [DONE]
*   **Status:** DONE - YYYY-MM-DD (Please replace with actual date)
*   **Related PRD Requirement(s):** Implied (General Cleanliness for Flomy MVP).
*   **Description:** Remove or replace any visual branding, logos, specific color schemes, author attributions, and placeholder content unique to the original "ncm-business-portfolio" boilerplate.
*   **Implementation Guidance:**
    *   Inspect the main layout file (`src/app/layout.tsx`) and any shared components like `Header` or `Footer` (if they exist in `src/components/shared/`) for boilerplate-specific logos, titles, or links. Replace with Flomy placeholders or remove.
    *   Check the root page (`src/app/page.tsx`) and potentially the original dashboard page (`src/app/(dashboard)/dashboard/page.tsx`) for placeholder text, images, or sections related to the boilerplate's theme. Remove them.
    *   Review `globals.css` and `tailwind.config.ts` for any highly specific custom theme names or color definitions tied to the boilerplate's branding. Reset to simpler defaults if necessary (though shadcn/ui themes are generally easy to manage later).
    *   Remove any footer text or links attributing the boilerplate to its original author (e.g., "Created by Yuval Avidani", "Fly High With YUV.AI" references found in the original README).
    *   Update the HTML `<title>` tag and any default meta descriptions in `src/app/layout.tsx` to reflect "Flomy".
*   **Acceptance Criteria:** The application's visible UI is free from specific branding elements, logos, and placeholder content related to the original "ncm-business-portfolio" boilerplate. Basic layout structure remains.

**TASK-00.1: Replace Boilerplate Author Details with Orr Shoshan Levy Details** [DONE]
*   **Status:** DONE - YYYY-MM-DD (Please replace with actual date)
*   **Related PRD Requirement(s):** Implied (General Cleanliness & Correct Attribution).
*   **Description:** Scan the codebase and documentation (`README.md`, component files, page files, layouts) for remaining instances of "Yuval Avidani", "YUV.AI", related links (linktr.ee/yuvai, yuv.ai, specific social handles), and bio text. Replace them with details for "Orr Shoshan Levy" (BSC Computer Science, 7 years experience, Founder of AutoNinja, website autoninja.co.il, all rights reserved).
*   **Implementation Guidance:**
    *   Check `Template/src/app/(dashboard)/dashboard/page.tsx` for the profile summary section.
    *   Check `Template/src/app/(dashboard)/layout.tsx` or shared components for any footer elements.
    *   Check `Template/README.md` for author references.
    *   Perform a codebase search for relevant strings (e.g., "Yuval Avidani", "YUV.AI", "linktr.ee/yuvai", "Fly High With YUV.AI").
    *   **Note:** User profile information displayed within Clerk components (like `<UserProfile />` likely used on the Settings page) must be updated by the logged-in user directly in their Clerk profile settings. This task focuses on hardcoded values in the application source code and documentation.
*   **Acceptance Criteria:** Codebase and documentation are updated with Orr Shoshan Levy's details where applicable. User advised on updating Clerk profile separately.

**TASK-01: Remove Unnecessary Boilerplate Features**
*   **Related PRD Requirement(s):** Implied by focus on Flomy features.
*   **Description:** Remove the placeholder "Project Management", "Analytics", and potentially "Settings" features from the boilerplate to make way for Flomy's core functionality.
*   **Implementation Guidance:**
    *   Delete page directories: `src/app/(dashboard)/projects/`, `src/app/(dashboard)/analytics/`, `src/app/(dashboard)/settings/`.
    *   Delete API routes related to projects: `src/app/api/projects/` (and any `[id]` sub-routes).
    *   Delete the corresponding database model: `src/models/Project.ts`.
    *   Remove any related chart components from `src/components/charts/` if they are no longer needed.
    *   Update the main dashboard layout (`src/app/(dashboard)/layout.tsx`) to remove navigation links to these deleted sections.
*   **Acceptance Criteria:** The boilerplate's project/analytics/settings pages, APIs, models, and related navigation are removed. The application still builds and runs.

**TASK-02: Install Required Dependencies**
*   **Related PRD Requirement(s):** Section 5.3 (Key Additional Libraries/Services)
*   **Description:** Add necessary libraries for OCR, file storage, data fetching, and date manipulation.
*   **Implementation Guidance:**
    *   Run `npm install` or `yarn add` for the following (choose one option where applicable):
        *   OCR Service SDK (e.g., `@google-cloud/vision` for Google Cloud Vision).
        *   File Storage SDK (e.g., `aws-sdk` for S3 or `@google-cloud/storage` for GCS). Choose based on PRD clarification (Open Question 7.2). Assume GCS for now if unspecified: `@google-cloud/storage`.
        *   Client-Side Data Fetching (e.g., `swr` or `@tanstack/react-query`). Check if one is already installed; if not, install `swr`.
        *   Date Manipulation (e.g., `date-fns` or `dayjs`). Install `date-fns`.
*   **Acceptance Criteria:** All required dependencies are added to `package.json` and installed successfully.

**TASK-03: Configure Environment Variables**
*   **Related PRD Requirement(s):** NFR-003, Section 5.3, Section 7.2 (Open Questions)
*   **Description:** Add placeholders and potentially set up necessary environment variables for the new services.
*   **Implementation Guidance:**
    *   Edit `.env.local` (create if it doesn't exist based on `.env.example`).
    *   Add variables for the chosen OCR service (e.g., `GOOGLE_APPLICATION_CREDENTIALS` path or specific keys if not using ADC).
    *   Add variables for the chosen File Storage service (e.g., `GCS_BUCKET_NAME`, `GCS_PROJECT_ID`, potentially service account key path if not using ADC).
    *   Ensure existing Clerk and MongoDB variables (`MONGODB_URI`, `MONGODB_DB_NAME`, Clerk keys) are present and correctly configured.
*   **Acceptance Criteria:** `.env.local` file contains all necessary environment variable keys for Clerk, MongoDB, OCR, and File Storage.

---

## Phase 2: Backend Development (Data, Storage, API)

**TASK-04: Create Payment Database Model**
*   **Related PRD Requirement(s):** FR-005, Section 6 (Data Model)
*   **Description:** Define the Mongoose schema for storing payment information in MongoDB.
*   **Implementation Guidance:**
    *   Create a new file: `src/models/Payment.ts`.
    *   Import Mongoose.
    *   Define a Mongoose schema named `paymentSchema` including fields as specified in `PRD.MD Section 6`: `userId` (String, required, indexed), `amount` (Number, required), `dueDate` (Date, required, indexed), `supplierName` (String), `status` (String, enum: ["Unpaid", "Paid"], required, default: "Unpaid", indexed), `originalFileName` (String, required), `storageProvider` (String, required, e.g., "GCS"), `storageFileRef` (String, required), `ocrConfidence` ({ amount: Number, dueDate: Number }, optional), `createdAt`, `updatedAt` (via timestamps: true).
    *   Compile and export the model: `mongoose.model('Payment', paymentSchema)`. Check for existing model definitions to ensure consistency (e.g., using `mongoose.models.Payment || mongoose.model('Payment', paymentSchema)`).
*   **Acceptance Criteria:** A `src/models/Payment.ts` file exists and correctly defines the schema and model for the `payments` collection in MongoDB.

**TASK-05: Setup File Storage Service Integration**
*   **Related PRD Requirement(s):** FR-005, NFR-001, Section 5.3
*   **Description:** Create utility functions to interact with the chosen cloud storage service (e.g., Google Cloud Storage) for uploading and potentially retrieving/deleting bill files.
*   **Implementation Guidance:**
    *   Create a new file: `src/lib/storage.ts` (or similar).
    *   Import the chosen SDK (e.g., `@google-cloud/storage`).
    *   Initialize the storage client using environment variables (consider authentication strategies like Application Default Credentials).
    *   Implement an `uploadFile` function that takes a file buffer/stream and desired destination path (e.g., `userId/originalFileName`) and uploads it to the configured bucket (e.g., `GCS_BUCKET_NAME`). This function should return the `storageFileRef` (e.g., the file path within the bucket).
    *   Consider implementing a `deleteFile` function (if required by PRD clarification - Open Question 7.2).
    *   Handle potential errors during interaction with the storage service.
*   **Acceptance Criteria:** Utility functions exist in `src/lib/storage.ts` to upload files to the configured cloud storage provider.

**TASK-06: Create Bill Upload API Route**
*   **Related PRD Requirement(s):** FR-002, FR-003, NFR-003
*   **Description:** Create an API endpoint that accepts file uploads (image/pdf), stores the file, triggers OCR analysis, and returns extracted data or an identifier for polling.
*   **Implementation Guidance:**
    *   Create an API route file structure: `src/app/api/upload/route.ts`.
    *   Use Next.js API route handlers (`POST`).
    *   Implement logic to parse `multipart/form-data` requests to get the uploaded file. Libraries like `formidable` might be helpful, or handle raw `request.formData()`.
    *   Validate file type (JPG, PNG, PDF) and size (use PRD limit, e.g., 10MB). Return appropriate error responses (400 Bad Request).
    *   Use the `uploadFile` utility (from TASK-05) to save the validated file to cloud storage, generating the `storageFileRef`.
    *   Trigger the OCR analysis (TASK-07) using the file buffer or storage reference.
    *   Trigger data extraction (TASK-08) from the OCR results.
    *   Return the extracted data (`amount`, `dueDate`, `supplierName`, confidence scores) and the `originalFileName`, `storageFileRef` to the client for the confirmation step (FR-004).
    *   Ensure the route is protected and only accessible by authenticated users (use Clerk's `auth()` helper). Extract `userId` for associating data.
    *   Handle errors gracefully throughout the process (upload failure, OCR failure, extraction failure) and return meaningful error responses (e.g., 500 Internal Server Error with details logged).
*   **Acceptance Criteria:** A protected API endpoint `/api/upload` exists, accepts valid bill files, uploads them, triggers analysis, and returns extracted data or appropriate errors.

**TASK-07: Implement OCR Integration Logic**
*   **Related PRD Requirement(s):** FR-003, NFR-002, Section 5.3
*   **Description:** Integrate the chosen OCR service to extract text from uploaded bill files.
*   **Implementation Guidance:**
    *   Create a utility function, potentially in `src/lib/ocr.ts`.
    *   Import the OCR SDK (e.g., `@google-cloud/vision`). Initialize the client.
    *   Implement a function `extractTextFromBill(fileBuffer: Buffer | string)` where the input could be the file buffer or the `storageFileRef` (depending on API capabilities and efficiency).
    *   Call the OCR API (e.g., Google Vision's `textDetection` or `documentTextDetection`) with the file content/reference.
    *   Handle API responses, including potential errors or timeouts (PRD Edge Cases).
    *   Return the raw extracted text (usually a single string or structured text blocks).
    *   This function will be called by the `/api/upload` route (TASK-06).
*   **Acceptance Criteria:** A utility function exists to call the configured OCR service and return the extracted text from a bill file.

**TASK-08: Implement Data Extraction Logic**
*   **Related PRD Requirement(s):** FR-003, PRD Edge Cases
*   **Description:** Process the raw text extracted by OCR to find the payment amount, due date, and supplier name using Regex and heuristics.
*   **Implementation Guidance:**
    *   Create a utility function, potentially in `src/lib/extractBillData.ts` or within `src/lib/ocr.ts`.
    *   Input: Raw text string from OCR (TASK-07).
    *   Implement Regular Expressions tailored for common Israeli bill formats (PRD FR-003 hints: currency symbols ₪/ש"ח, date formats DD/MM/YYYY, DD.MM.YYYY, keywords like "לתשלום עד").
    *   Search for payment amount patterns. Handle potential multiple matches (e.g., take the largest amount as per PRD).
    *   Search for due date patterns. Handle potential multiple matches (e.g., take the latest date). Convert found date strings into Date objects.
    *   Attempt supplier name extraction (best-effort, lower priority).
    *   Handle cases where amount or date are not found.
    *   Return an object containing `{ amount: number | null, dueDate: Date | null, supplierName: string | null }`. Consider adding confidence scores if applicable/possible.
    *   This function will be called by the `/api/upload` route (TASK-06) after OCR.
*   **Acceptance Criteria:** A utility function exists that takes OCR text and returns extracted amount, due date, and supplier name based on defined patterns, handling common edge cases.

**TASK-09: Create Payment CRUD API Routes**
*   **Related PRD Requirement(s):** FR-005, FR-006, FR-007, NFR-003
*   **Description:** Create API endpoints for creating, reading, updating (status, details), and deleting payment records.
*   **Implementation Guidance:**
    *   Create API route structure: `src/app/api/payments/route.ts` (for GET list, POST create) and `src/app/api/payments/[id]/route.ts` (for PUT update, DELETE).
    *   Use the Mongoose `Payment` model (TASK-04) and `dbConnect` utility (`src/lib/db.ts`).
    *   **POST `/api/payments`:**
        *   Accepts validated `amount`, `dueDate`, `supplierName`, `originalFileName`, `storageProvider`, `storageFileRef` in the request body.
        *   Requires authenticated `userId` from Clerk's `auth()`.
        *   Creates a new Payment document with `status: "Unpaid"`.
        *   Returns the created payment record (201 Created) or error (400, 500).
    *   **GET `/api/payments`:**
        *   Requires authenticated `userId`.
        *   Fetches all Payment documents for that `userId` where `status: "Unpaid"`.
        *   Sorts results by `dueDate` ascending.
        *   Returns the list of payments (200 OK) or error (500).
    *   **PUT `/api/payments/[id]`:**
        *   Requires authenticated `userId`. Extracts `id` from the route parameter.
        *   Accepts fields to update in the request body (e.g., `status`, `amount`, `dueDate`, `supplierName`).
        *   Finds the payment by `_id` AND `userId` (ensures user owns the record).
        *   Updates the record.
        *   Returns the updated payment record (200 OK) or error (404 Not Found, 403 Forbidden, 500). Used for "Mark as Paid" and "Edit".
    *   **DELETE `/api/payments/[id]`:**
        *   Requires authenticated `userId`. Extracts `id`.
        *   Finds the payment by `_id` AND `userId`.
        *   Deletes the record. (Consider deleting the associated file from storage based on PRD clarification - Open Question 7.2. If yes, call `deleteFile` from TASK-05).
        *   Returns success (204 No Content) or error (404, 403, 500).
    *   Protect all routes using Clerk's `auth()`.
*   **Acceptance Criteria:** Protected API endpoints exist at `/api/payments` and `/api/payments/[id]` supporting CRUD operations for payment records, ensuring users can only access their own data.

---

## Phase 3: Frontend Development (Components & UI)

**TASK-10: Create Bill Upload Component**
*   **Related PRD Requirement(s):** FR-002
*   **Description:** Develop the frontend component allowing users to select and upload a bill file.
*   **Implementation Guidance:**
    *   Create a new client component: `src/components/flomy/BillUploadForm.tsx` (or similar).
    *   Use shadcn/ui components (`Button`, `Input type="file"`, potentially `Progress` or `Spinner`).
    *   Include a button ("Add New Bill") that triggers the file input.
    *   Handle file selection, validating the file type (client-side check) and size against limits (from PRD). Display errors using `Toast` or inline messages.
    *   On valid file selection, initiate the upload to the `/api/upload` endpoint (TASK-06). Use `fetch` or a library like `axios`.
    *   Display loading state during upload.
    *   Handle success (receive extracted data) and error responses from the API. On success, trigger the display of the Confirmation Component (TASK-11), passing the data. On error, show a `Toast` message.
*   **Acceptance Criteria:** A component allows users to select valid files, initiate uploads, shows progress/feedback, and triggers the next step (confirmation) on success.

**TASK-11: Create Data Confirmation/Correction Component**
*   **Related PRD Requirement(s):** FR-004
*   **Description:** Develop the UI component (likely a Modal/Dialog) where users review extracted data, make corrections, and confirm to save the payment record.
*   **Implementation Guidance:**
    *   Create a new client component: `src/components/flomy/ConfirmationDialog.tsx` (or similar).
    *   Use shadcn/ui `Dialog`, `Card`, `Input`, `DatePicker`, `Button`.
    *   Accept the extracted data (`amount`, `dueDate`, `supplierName`, `originalFileName`, `storageFileRef`) and potentially the image/PDF preview URL (if feasible/required) as props.
    *   Display the bill preview (if possible).
    *   Display input fields for Amount (numeric validation), Due Date (use Date Picker), and Supplier Name, pre-filled with extracted data.
    *   Clearly indicate if fields were auto-filled or require manual input (e.g., empty fields, visual cues).
    *   Implement client-side validation for required fields (Amount, Due Date).
    *   Include "Save" and "Cancel" buttons.
    *   On "Save", send a POST request to `/api/payments` (TASK-09) with the confirmed/corrected data (`amount`, `dueDate`, `supplierName`, plus `originalFileName`, `storageProvider`, `storageFileRef` received earlier).
    *   Handle API response: On success, close the dialog and trigger a dashboard refresh/show success `Toast`. On error, display error message within the dialog or as a `Toast`.
    *   On "Cancel", simply close the dialog.
*   **Acceptance Criteria:** A dialog component displays extracted data, allows user correction and validation, and saves the confirmed payment record via API call.

**TASK-12: Modify Dashboard Page**
*   **Related PRD Requirement(s):** FR-006
*   **Description:** Update the main dashboard page to display the list of upcoming payments instead of the old boilerplate content.
*   **Implementation Guidance:**
    *   Modify the existing dashboard page: `src/app/(dashboard)/dashboard/page.tsx`. This should likely be a Client Component to handle data fetching and state.
    *   Remove existing boilerplate content (chart displays, project summaries).
    *   Implement data fetching using SWR/React Query (TASK-16) to call the GET `/api/payments` endpoint (TASK-09).
    *   Display a loading state while fetching data.
    *   Display an error state if fetching fails.
    *   Display the "Add New Bill" button/component (TASK-10).
    *   Display the Payment List component (TASK-13), passing the fetched payment data.
    *   Display the "Total Amount Due This Month" summary (calculation logic needed - TASK-17).
    *   Display the empty state message (TASK-19) when no unpaid payments exist.
*   **Acceptance Criteria:** The dashboard page at `/dashboard` fetches and displays the user's upcoming payments, the upload button, and summary info, replacing the old content.

**TASK-13: Create Payment List/Card Component**
*   **Related PRD Requirement(s):** FR-006
*   **Description:** Develop the component responsible for rendering the list or cards of upcoming payments on the dashboard.
*   **Implementation Guidance:**
    *   Create a new client component: `src/components/flomy/PaymentList.tsx` (or similar).
    *   Use shadcn/ui `Card` or `Table` components to display payments.
    *   Accept the list of payment objects (fetched in TASK-12) as props.
    *   For each payment, display: `supplierName` (or placeholder), `amount` (formatted), `dueDate` (formatted), and calculated "Days Remaining" (TASK-17).
    *   Ensure payments are displayed in ascending order of `dueDate`.
    *   Visually highlight payments due soon (e.g., within 3 days) using conditional styling (TASK-18).
    *   Include action buttons ("Mark as Paid", "Edit", "Delete") for each payment (logic implemented in TASK-14).
*   **Acceptance Criteria:** A component renders a sorted list/cards of payments with required details, visual highlighting, and action buttons.

**TASK-14: Implement Dashboard Actions (Mark Paid, Edit, Delete)**
*   **Related PRD Requirement(s):** FR-007
*   **Description:** Add functionality to the "Mark as Paid", "Edit", and "Delete" buttons within the Payment List component.
*   **Implementation Guidance:**
    *   Implement logic within `PaymentList.tsx` or via callback props passed from `dashboard/page.tsx`.
    *   **Mark as Paid:**
        *   On click, send a PUT request to `/api/payments/[id]` (TASK-09) with `status: "Paid"`.
        *   On success, update the UI (remove the item from the list) and potentially show a `Toast`. Trigger re-fetch or mutate SWR/React Query cache.
    *   **Edit:**
        *   On click, open a modal/dialog (similar to Confirmation Dialog TASK-11) pre-filled with the payment's current data.
        *   Saving in the modal should send a PUT request to `/api/payments/[id]` with updated `amount`, `dueDate`, `supplierName`.
        *   On success, update the UI and show feedback. Trigger re-fetch/mutate cache.
    *   **Delete:**
        *   On click, show a confirmation dialog (use shadcn/ui `AlertDialog`).
        *   On confirmation, send a DELETE request to `/api/payments/[id]` (TASK-09).
        *   On success, update the UI (remove item) and show feedback. Trigger re-fetch/mutate cache.
    *   Handle API errors for all actions and provide user feedback.
*   **Acceptance Criteria:** Buttons on payment items trigger respective API calls (PUT for Mark Paid/Edit, DELETE for Delete) with confirmation where needed, and update the UI accordingly.

---

## Phase 4: Integration & Polish

**TASK-15: Integrate Upload, Confirmation, and Saving Flow**
*   **Related PRD Requirement(s):** FR-002, FR-003, FR-004, FR-005
*   **Description:** Ensure the frontend components for upload and confirmation work together seamlessly, leading to a saved payment record.
*   **Implementation Guidance:**
    *   Connect the output of `BillUploadForm.tsx` (TASK-10) - the extracted data from `/api/upload` - to the input props of `ConfirmationDialog.tsx` (TASK-11).
    *   Manage the state for showing/hiding the confirmation dialog, likely within the main `dashboard/page.tsx` component.
    *   Ensure that after successfully saving from the confirmation dialog, the dashboard data is refreshed (via SWR/React Query revalidation) to show the new payment.
*   **Acceptance Criteria:** User can click "Add New Bill", upload a file, receive extracted data in a confirmation dialog, correct/confirm it, save it, and see the new payment appear on the dashboard without manual refresh.

**TASK-16: Implement Client-Side Data Fetching (SWR/React Query)**
*   **Related PRD Requirement(s):** FR-006, NFR-002, Section 5.3
*   **Description:** Use a robust data fetching library to manage fetching, caching, and revalidation of payment data on the dashboard.
*   **Implementation Guidance:**
    *   If using SWR (installed in TASK-02), wrap the application or relevant layout with `SWRConfig` if needed.
    *   In `src/app/(dashboard)/dashboard/page.tsx` (TASK-12), use the `useSWR` hook to fetch data from `/api/payments`.
    *   Define a fetcher function (e.g., `fetcher = url => fetch(url).then(res => res.json())`).
    *   Handle loading and error states provided by the hook.
    *   Utilize the `mutate` function provided by `useSWR` after successful create, update, or delete operations (TASK-14, TASK-15) to update the cached data without a full reload.
*   **Acceptance Criteria:** Dashboard data is fetched using SWR/React Query, handles loading/error states, and UI updates efficiently after mutations.

**TASK-17: Implement Date Formatting and "Days Remaining" Calculation**
*   **Related PRD Requirement(s):** FR-006, Section 5.3
*   **Description:** Format due dates clearly and calculate the days remaining until the due date.
*   **Implementation Guidance:**
    *   Use the installed date library (`date-fns` - TASK-02).
    *   In `PaymentList.tsx` (TASK-13), format the `dueDate` object using `date-fns/format` (e.g., `format(new Date(dueDate), 'dd/MM/yyyy')`).
    *   Create a helper function (perhaps in `src/lib/utils.ts`) or calculate directly in the component: Use `date-fns/differenceInDays` to find the difference between the `dueDate` and the current date (`new Date()`).
    *   Display the result as "X days remaining", "Due today", "Overdue by X days". Handle edge cases gracefully.
    *   For "Total Amount Due This Month" (TASK-12), filter the fetched payments using `date-fns` functions (e.g., `isSameMonth`, `startOfMonth`, `endOfMonth`) to identify payments due in the current calendar month and sum their amounts.
*   **Acceptance Criteria:** Due dates are formatted consistently, days remaining are calculated and displayed accurately, and the monthly total is calculated correctly.

**TASK-18: Implement Visual Highlighting for Due Payments**
*   **Related PRD Requirement(s):** FR-006
*   **Description:** Apply distinct visual styling to payments that are due very soon.
*   **Implementation Guidance:**
    *   In `PaymentList.tsx` (TASK-13), use the calculated "Days Remaining" (TASK-17).
    *   Apply conditional TailwindCSS classes to the payment Card/Table row based on the days remaining (e.g., if days remaining <= 3 and >= 0).
    *   Use noticeable styling like a border color, background tint, or an icon (using `lucide-react`).
*   **Acceptance Criteria:** Payments due within the specified timeframe (e.g., 3 days) are visually distinct from other upcoming payments.

**TASK-19: Implement Empty State for Dashboard**
*   **Related PRD Requirement(s):** FR-006
*   **Description:** Display a helpful message when the user has no upcoming payments.
*   **Implementation Guidance:**
    *   In `src/app/(dashboard)/dashboard/page.tsx` (TASK-12), check if the fetched payment data array is empty after filtering for "Unpaid" status.
    *   If empty, conditionally render a message instead of the `PaymentList` component.
    *   Use shadcn/ui components (e.g., `Card` with text) to style the message attractively. Include text like "No upcoming bills!" and potentially guide the user towards the "Add New Bill" button.
*   **Acceptance Criteria:** A clear and user-friendly empty state message is shown on the dashboard when there are no unpaid bills.

**TASK-20: Ensure Responsiveness and Styling**
*   **Related PRD Requirement(s):** NFR-004
*   **Description:** Ensure the new Flomy UI elements (upload, dialog, dashboard list) are responsive and visually consistent.
*   **Implementation Guidance:**
    *   Review all new components (TASK-10, TASK-11, TASK-13) and the main dashboard page (TASK-12).
    *   Apply TailwindCSS responsive modifiers (`sm:`, `md:`, `lg:`) as needed to ensure usability on different screen sizes (mobile, tablet, desktop).
    *   Ensure consistent use of shadcn/ui components and adherence to the overall theme (colors, spacing).
    *   Test on various viewport sizes using browser developer tools.
*   **Acceptance Criteria:** The Flomy application interface is responsive and visually appealing across common device sizes.

---

## Phase 5: Authentication & Security

**TASK-21: Secure API Routes and Data Access**
*   **Related PRD Requirement(s):** FR-001, NFR-003
*   **Description:** Verify that all API routes handling sensitive data or actions are protected by Clerk authentication and authorization logic.
*   **Implementation Guidance:**
    *   Review all API routes created/modified (TASK-06, TASK-09).
    *   Ensure Clerk's `auth()` helper (from `@clerk/nextjs/server`) is used at the beginning of each route handler (`GET`, `POST`, `PUT`, `DELETE`) to get the `userId`.
    *   If `userId` is not present, return a 401 Unauthorized error.
    *   In all database operations (fetching, creating, updating, deleting payments), ensure queries explicitly include `userId: userId` in the filter conditions to prevent users from accessing or modifying data belonging to others.
    *   Review Clerk middleware setup (in `middleware.ts` if it exists) to ensure it protects the `/dashboard` route group and potentially `/api` routes correctly.
*   **Acceptance Criteria:** All payment-related API endpoints require authentication, and database queries are scoped to the authenticated user's data. Unauthorized access attempts are blocked.

--- 