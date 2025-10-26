## 🧩 **React–Backend Integration Prompt Guide**

This guide defines **exactly how backend API integrations must be implemented** in the React frontend.
Whenever I request you to integrate a backend functionality, **you must follow these directives.**

---

### 🔹 **Input Format**

Each integration request will include:

1. **Functionality Description**
   → Brief explanation of what the feature does.

2. **API Information**

    * API endpoint (e.g. `{{base_url}}/api/paiements/depot`)
    * HTTP method (GET, POST, PUT, DELETE, etc.)
    * Example request body *(if applicable)*:

      ```json
      {
        "id_utilisateur": "USR-000001",
        "montant": 50000.00,
        "typepaiement": null
      }
      ```
    * Example backend response *(JSON format)*

3. **Component Target**

    * If an existing component should handle this functionality → provide the path (e.g. `@frontend/src/pages/product/ProductForm.tsx`)
    * If a new component must be created → it will be explicitly mentioned.

---

### 🔹 **File and Folder Structure Guidelines**

#### 🗂 `@frontend/src/services/`

* Create a **service class or function** for each API entity (e.g. `paymentService.ts`).
* Always use the **shared API client**:
  `@frontend/src/services/apiClient.ts` for making HTTP requests (`axios` or `fetch` wrapper).
* Follow consistent naming:

    * `getAllPayments()`, `createPayment(data)`, `updatePayment(id, data)`, `deletePayment(id)`, etc.
* Include proper error handling with `try/catch`.

#### 🗂 `@frontend/src/pages/`

* Create or modify a page component corresponding to the functionality.
* Folder naming:

    * `@frontend/src/pages/{feature}/` (e.g. `@frontend/src/pages/product/`, `@frontend/src/pages/payment/`)
* Each folder may contain:

    * `index.tsx` (main entry component)
    * Subcomponents (e.g. `Form.tsx`, `List.tsx`, `Details.tsx`)

#### 🗂 `@frontend/src/components/`

* For **reusable** UI components shared across pages.
* Example: `ConfirmationModal.tsx`, `DataTable.tsx`.

#### 🗂 `@frontend/src/components/ui/`

* Contains Shadcn UI components (e.g. Button, Card, Input).
  🔸 **Do not modify directly.**
  Instead, compose or extend them in `src/components/`.

#### 🗂 `@frontend/src/hooks/`

* Place all **custom React hooks** here (e.g. `useFetchPayments`, `useFormSubmit`).

#### 🗂 `@frontend/src/lib/`

* For **utility logic**, helpers, constants, and reusable functions.
* Example: `formatDate()`, `formatCurrency()`, `getErrorMessage()`.
* Common helpers go inside `src/lib/utils.ts`.

#### 🗂 `@frontend/src/assets/`

* For **static files** such as images, fonts, and icons.

---

### 🔹 **Implementation Standards**

#### ✅ API Integration Pattern

1. Create or update the relevant **service file** in `src/services/`.
2. Import and use it inside the page or component.
3. Handle:

    * Loading state
    * Error state
    * Success state (confirmation, toast, or redirect)

#### ✅ Data Flow Convention

* **Service Layer** → makes API calls
* **Component/Page** → handles state and renders UI

#### ✅ Naming Conventions

* Functions: `getAllX`, `getXById`, `createX`, `updateX`, `deleteX`
* State variables: `data`, `loading`, `error`
* Use consistent camelCase naming for variables and methods.

#### ✅ Error & Response Handling

* Always wrap service calls with `try/catch`.
* Use a consistent toast or alert component (e.g. `shadcn/ui` toast) for user feedback.
* Display backend validation or server errors clearly in the UI.

#### ✅ UI/UX Rules

* Follow **existing color palette** (don’t introduce new colors).
* Use **TailwindCSS** and **shadcn** components.
* Maintain responsive layout (especially for forms and tables).
  * always include @frontend/src/components/layout/Header.tsx in each pages component that you create 
* When relevant, show:

    * **Loader** during requests
    * **Toast** on success or error
    * **Empty states** when no data

---

### 🔹 **Example Integration Flow**

**Input Example:**

```text
Functionality: Deposit payment
API URL: POST {{base_url}}/api/paiements/depot
Body:
{
  "id_utilisateur": "USR-000001",
  "montant": 50000.00,
  "typepaiement": null
}
Response:
{
  "status": "success",
  "message": "Paiement enregistré",
  "data": {...}
}
Component: @frontend/src/pages/payment/DepositForm.tsx
```

**Expected Output (Summary of Steps):**

1. Create or update `paymentService.ts` with:

   ```ts
   export async function createDeposit(data) {
     return apiClient.post('/api/paiements/depot', data);
   }
   ```
2. In `DepositForm.tsx`:

    * Import `createDeposit`
    * Handle form input and submission
    * Show loading state, success toast, or error alert

---

### 🔹 **Extra Rules**

* Keep all file paths **relative to `src/`**.
* Prefer **TypeScript interfaces** for API responses.
* Use **async/await** syntax.