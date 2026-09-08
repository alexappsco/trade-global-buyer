نعم. سأعيد صياغته بحيث يكون **Instruction/Contract للـ AI Agent** وليس مجرد documentation وصفي. أهم تعديل سيكون في Server Actions، مع منع الـ pass-through actions صراحةً، وإعطاء Templates كاملة لكل نوع من أنواع الطلبات.

 # Aspire Academy — AI Agent Working Guide

 ## Architecture, Conventions & Mandatory Implementation Rules

 > **IMPORTANT:** This document is an implementation contract for AI coding agents working on the Aspire Academy project.\
>  The agent MUST follow these rules when creating or modifying code. Do not simplify, skip, or replace required implementation steps with shorter alternatives unless the existing project code explicitly requires it.

---

 ## 1\. Tech Stack & Runtime

 - **Next.js 16** (App Router) + **Turbopack**
- **React 19** \+ **TypeScript** (strict)
- **MUI** (Material UI)
- **next-intl** for i18n
  - Locales: `ar` / `en`
  - RTL support
- Monorepo-side exports via `src/` path alias:
  - `import X from 'src/...'`

---

 # 2\. Environment / Configuration

 `.env.local` contains:

```
NEXT_PUBLIC_HOST_API=https://api-staging.aspirekwt.com/api/v1
```

 ### Mandatory rules

 - **DO NOT change `NEXT_PUBLIC_HOST_API`.**
- `src/config-global.ts` exports `HOST_API`, `COOKIES_KEYS`, `PATH_AFTER_LOGIN`, etc.
- The backend base URL already contains:

```
/api/v1
```

 Therefore:

 > **DO NOT automatically prepend `/api/v1` to endpoint strings.**

 However, the agent MUST inspect the existing project/backend conventions before creating an endpoint.

 If existing project endpoints intentionally contain an additional version/path segment required by the backend, preserve that convention.

 **Never blindly duplicate `/api/v1`.**

---

 # 3\. Folder Structure — CORE RULE

```
src/
  app/[locale]/(dashboard)/<route>/page.tsx
      → Next.js page
      → Thin wrapper
      → Renders the Section View

  app/api/
      → ❌ DO NOT CREATE
      → ❌ DO NOT USE
      → This folder is deleted/not used

  actions/
      → Server Actions
      → Backend API binding layer

  sections/<feature>/
      → UI components
      → view.tsx
      → dialogs
      → sub-components

  types/
      → TypeScript domain types
      → One file per domain

  utils/
      → Shared utilities
      → crud-fetch-api.ts = HTTP layer

  routes/paths.ts
      → Route path constants
```

 ## Responsibility of each layer

 | Concern | Location | Rule |
| --- | --- | --- |
| Page / Route | `src/app/[locale]/(dashboard)/<route>/page.tsx` | Thin wrapper only |
| Backend binding | `src/actions/<domain>.ts` | Server Actions |
| UI | `src/sections/<feature>/` | Client components |
| Domain types | `src/types/<domain>.ts` | Domain-specific types |
| Shared API types | `src/types/crud-types.ts` | Generic API types only |
| HTTP requests | `src/utils/crud-fetch-api.ts` | The ONLY backend HTTP layer |
| Endpoint registry | `src/utils/endpoints.ts` | Central endpoint definitions |

---

 # 4\. Data Flow — MANDATORY

 The application follows this architecture:

```
Page
  ↓
Section View / UI
  ↓
Server Action
  ↓
crud-fetch-api.ts
  ↓
Backend API
```

 More precisely:

```
Client Component
    │
    │ directly calls
    ▼
Server Action
src/actions/<domain>.ts
    │
    │ prepares request
    │ validates response
    │ normalizes result
    ▼
crud-fetch-api.ts
    │
    │ getData / postData / editData / deleteData
    ▼
Backend
```

 ## NEVER do this

```
Client
  ↓
fetch('/api/...')
  ↓
Next.js API Route
  ↓
Backend
```

 There are **no Next.js API proxy routes** in this architecture.

---

 # 5\. Backend Communication Rules

 ## Rule 1 — Only `crud-fetch-api.ts` communicates with the backend

 Do not use:

```
fetch(...)
```

 or:

```
axios(...)
```

 inside:

 - Section components
- Dialogs
- Pages
- Server Actions

 Server Actions MUST use the helpers from:

```
src/utils/crud-fetch-api.ts
```

 Available helpers may include:

```
getData
postData
editData
deleteData
```

 Use the helper that matches the HTTP operation.

---

 # 6\. SERVER ACTIONS — CRITICAL AI AGENT RULES

 ## This section is MANDATORY

 Server Actions are **NOT simple pass-through wrappers**.

 A Server Action is a backend binding and normalization layer.

 ### ❌ FORBIDDEN: Pass-through actions

 The following implementation pattern is **NOT acceptable**:

```
export async function getSomething() {
  return await getData('/some-endpoint');
}
```

 Also forbidden:

```
export async function createSomething(data: SomeType) {
  return await postData('/some-endpoint', data);
}
```

 Also forbidden:

```
export async function deleteSomething(id: string) {
  return await deleteData(`/some-endpoint/${id}`);
}
```

 ### IMPORTANT

 **Do NOT generate one-line or minimal Server Actions just because the HTTP helper already returns a response.**

 The Server Action MUST explicitly handle the request and response lifecycle.

---

 # 7\. Required Server Action Lifecycle

 Every Server Action MUST follow this conceptual flow:

```
1. Receive typed parameters
        ↓
2. Prepare request
   - Query parameters
   - Request body
   - FormData
   - Endpoint + ID
        ↓
3. Call the correct crud-fetch-api helper
        ↓
4. Validate the returned response
        ↓
5. Extract / normalize the useful data
        ↓
6. Return a predictable application-level result
        ↓
7. Handle errors in catch
```

 The exact implementation depends on the endpoint.

---

 # 8\. Mandatory Server Action Structure

 Every Server Action file MUST:

 - Start with:

```
'use server';
```

 - Import only the required HTTP helpers.
- Use typed request/response data.
- Wrap backend calls in `try/catch`.
- Validate `res.success`.
- Extract nested response data when necessary.
- Return an explicit success object.
- Return an explicit error object on failure.
- Never silently ignore backend failures.
- Never blindly return the raw `crud-fetch-api` result when normalization is required.
- Preserve framework redirect errors such as `NEXT_REDIRECT`.

---

 # 9\. Error Handling — MANDATORY

 Server Actions MUST handle unexpected errors.

 Recommended pattern:

```
catch (error) {
  if (
    error &&
    typeof error === 'object' &&
    'digest' in error &&
    String((error as { digest: string }).digest).startsWith('NEXT_REDIRECT')
  ) {
    throw error;
  }

  return {
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error',
  };
}
```

 ### Why?

 Do not swallow Next.js redirect exceptions.

 If the existing project uses this `NEXT_REDIRECT` handling pattern, preserve it consistently in new Server Actions.

---

 # 10\. Server Action Response Normalization

 The Server Action should expose the data that the UI actually needs.

 For example, if the HTTP layer returns:

```
{
  success: true,
  data: {
    data: [...],
    meta: {...}
  }
}
```

 The Server Action may normalize it to:

```
{
  success: true,
  data: [...],
  meta: {...}
}
```

 The UI should NOT need to understand unnecessary backend/HTTP wrapper layers.

---

 # 11\. GET LIST ACTION — REQUIRED PATTERN

 For list endpoints with filtering/pagination, the Action MUST construct the query parameters.

 ### Example

```
export async function getEmployeesAction(
  params: {
    name?: string;
    is_active?: number;
    page?: number;
    limit?: number;
  } = {}
) {
  try {
    const query = new URLSearchParams();

    if (params.name) {
      query.set('name', params.name);
    }

    if (params.is_active !== undefined) {
      query.set('is_active', String(params.is_active));
    }

    if (params.page) {
      query.set('page', String(params.page));
    }

    if (params.limit) {
      query.set('limit', String(params.limit));
    }

    const qs = query.toString();

    const res = await getData<ApiListResponse<Employee>>(
      `${endpoints.employees.list}${qs ? `?${qs}` : ''}`
    );

    if (res.success && res.data && Array.isArray(res.data.data)) {
      return {
        success: true,
        data: res.data.data,
        meta: res.data.meta ?? {
          page: params.page ?? 1,
          limit: params.limit ?? 10,
          total: res.data.data.length,
        },
      };
    }

    return {
      success: false,
      error:
        'error' in res
          ? res.error
          : 'Failed to fetch employees',
      data: [],
      meta: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: 0,
      },
    };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      String((error as { digest: string }).digest).startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
      data: [],
      meta: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total: 0,
      },
    };
  }
}
```

 ### Mandatory list rules

 If the endpoint supports:

 - search
- filtering
- pagination
- sorting

 the Server Action MUST construct and send those parameters.

 **Do not declare `params` and then ignore them.**

---

 # 12\. GET DETAILS ACTION

 For an entity-details endpoint:

```
export async function getEmployeeAction(id: string) {
  try {
    const res = await getData<ApiSingleResponse<Employee>>(
      endpoints.employees.details(id)
    );

    if (res.success && res.data && res.data.data) {
      return {
        success: true,
        data: res.data.data,
      };
    }

    return {
      success: false,
      error:
        'error' in res
          ? res.error
          : 'Failed to fetch employee',
    };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      String((error as { digest: string }).digest).startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    };
  }
}
```

 The Action MUST:

 1. Receive the ID.
2. Build/use the correct endpoint.
3. Call `getData`.
4. Validate the response.
5. Extract the actual entity.
6. Return success/error.
7. Handle exceptions.

---

 # 13\. CREATE ACTION

 Create Actions MUST explicitly prepare the request.

 ### JSON example

```
export async function createRoleAction(data: {
  name_ar: string;
  name_en: string;
  permissions: Record<
    string,
    {
      view: boolean;
      add: boolean;
      edit: boolean;
      delete: boolean;
    }
  >;
}) {
  try {
    const res = await postData<
      ApiSingleResponse<EmployeeRoleItem>,
      typeof data
    >(
      endpoints.roles.create,
      data
    );

    if (res.success && res.data) {
      return {
        success: true,
        data: res.data.data,
      };
    }

    return {
      success: false,
      error:
        'error' in res
          ? res.error
          : 'Failed to create role',
    };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      String((error as { digest: string }).digest).startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    };
  }
}
```

---

 # 14\. CREATE / UPDATE WITH FILE UPLOADS

 If the backend expects multipart/form-data, the Server Action MUST build `FormData`.

 Example:

```
export async function createEmployeeAction(data: {
  name: string;
  phone: string;
  password: string;
  email?: string;
  role_id?: string;
  is_active: boolean;
  avatar?: AvatarData;
}) {
  try {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('password', data.password);
    formData.append('is_active', String(data.is_active));

    if (data.email) {
      formData.append('email', data.email);
    }

    if (data.role_id) {
      formData.append('role_id', data.role_id);
    }

    if (data.avatar) {
      const blob = base64ToBlob(
        data.avatar.base64,
        data.avatar.type
      );

      formData.append(
        'avatarFile',
        blob,
        data.avatar.name
      );
    }

    const res = await postData<
      ApiSingleResponse<Employee>,
      FormData
    >(
      endpoints.employees.create,
      formData
    );

    if (res.success && res.data) {
      return {
        success: true,
        data: res.data.data,
      };
    }

    return {
      success: false,
      error:
        'error' in res
          ? res.error
          : 'Failed to create employee',
    };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      String((error as { digest: string }).digest).startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    };
  }
}
```

 ### Mandatory rule

 If the backend requires `multipart/form-data`:

 > **DO NOT send a normal JSON object. Build `FormData` explicitly.**

 If binary/file data is received as Base64, convert it to a `Blob` before appending it to `FormData`.

---

 # 15\. UPDATE ACTION

 Update Actions follow the same complete pattern.

```
export async function updateEmployeeAction(
  id: string,
  data: {
    name: string;
    phone: string;
    password?: string;
    email?: string;
    is_active: boolean;
    role_id?: string;
    avatar?: AvatarData;
  }
) {
  try {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('is_active', String(data.is_active));

    if (data.password) {
      formData.append('password', data.password);
    }

    if (data.email) {
      formData.append('email', data.email);
    }

    if (data.role_id) {
      formData.append('role_id', data.role_id);
    }

    if (data.avatar) {
      const blob = base64ToBlob(
        data.avatar.base64,
        data.avatar.type
      );

      formData.append(
        'avatarFile',
        blob,
        data.avatar.name
      );
    }

    const res = await editData<
      ApiSingleResponse<Employee>,
      FormData
    >(
      endpoints.employees.update(id),
      'PUT',
      formData
    );

    if (res.success && res.data) {
      return {
        success: true,
        data: res.data.data,
      };
    }

    return {
      success: false,
      error:
        'error' in res
          ? res.error
          : 'Failed to update employee',
    };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      String((error as { digest: string }).digest).startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    };
  }
}
```

---

 # 16\. DELETE ACTION

 Delete Actions MUST still have explicit response handling.

 ### ❌ Forbidden

```
export async function deleteEmployeeAction(id: string) {
  return await deleteData(`/employees/${id}`);
}
```

 ### ✅ Required

```
export async function deleteEmployeeAction(id: string) {
  try {
    const res = await deleteData<Record<string, never>>(
      endpoints.employees.delete(id)
    );

    if (res.success) {
      return {
        success: true,
      };
    }

    return {
      success: false,
      error:
        'error' in res
          ? res.error
          : 'Failed to delete employee',
    };
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      String((error as { digest: string }).digest).startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unknown error',
    };
  }
}
```

---

 # 17\. Server Action Decision Matrix

 When creating an Action, determine which pattern applies:

 | Backend operation | HTTP helper | Required implementation |
| --- | --- | --- |
| List | `getData` | Query construction + response normalization |
| Details | `getData` | ID + response validation + data extraction |
| Create JSON | `postData` | Typed body + response validation |
| Create FormData | `postData` | Explicit `FormData` construction |
| Update JSON | `editData` | Typed body + method + response validation |
| Update FormData | `editData` | Explicit `FormData` construction |
| Delete | `deleteData` | Explicit success/error handling |

---

 # 18\. API RESPONSE RULES

 The agent MUST inspect the actual response shape used by the project before implementing an Action.

 Possible structures may include:

 ### Single entity

```
{
  success: true,
  data: {
    data: Entity
  }
}
```

 The Action should return:

```
{
  success: true,
  data: Entity
}
```

 ### List

```
{
  success: true,
  data: {
    data: Entity[],
    meta: {...}
  }
}
```

 The Action should normalize this according to what the UI needs.

 ### Failure

```
{
  success: false,
  error: '...'
}
```

 The Action should return an explicit failure result.

 **Do not assume every endpoint has the exact same response structure. Inspect existing types and reference Actions first.**

---

 # 19\. Types

 Create one domain types file:

```
src/types/<domain>.ts
```

 Example:

```
export type Specialization = {
  id: string;
  nameAr: string;
  nameEn: string;
  fieldId: string;
  field: {
    id: string;
    name: string;
  };
  isActive: boolean;
};

export type SpecializationListResponse = {
  items: Specialization[];
  totalCount: number;
};
```

 Do NOT place domain-specific types into:

```
src/types/crud-types.ts
```

 That file is reserved for shared/generic types such as:

```
ApiSingleResponse<T>
ApiResponse<T>
RequestOptions
```

---

 # 20\. Endpoints

 Register endpoints centrally in:

```
src/utils/endpoints.ts
```

 Example:

```
specializations: {
  list: '/admin/specializations',
  create: '/admin/specializations',
  details: (id: string) =>
    `/admin/specializations/${id}`,
  update: (id: string) =>
    `/admin/specializations/${id}`,
  delete: (id: string) =>
    `/admin/specializations/${id}`,
},
```

 ### Rules

 - Endpoint strings are relative to `HOST_API`.
- Do not duplicate the backend base URL.
- Prefer the endpoint registry instead of hardcoding URLs repeatedly.
- Related resources may also be registered:

```
fields: {
  list: '/admin/fields',
}
```

---

 # 21\. UI / Section

 Create:

```
src/sections/<domain>/
```

 Typical structure:

```
view.tsx
new-edit-dialog.tsx
delete-confirm-dialog.tsx
```

 The main View:

```
'use client';
```

 and is responsible for:

 - UI state
- filters
- search
- pagination state
- loading state
- calling Server Actions
- displaying success/error states

---

 # 22\. UI MUST NOT CALL THE BACKEND DIRECTLY

 ### ❌ Never

```
fetch('/api/employees')
```

 ### ❌ Never

```
fetch('https://api...')
```

 ### ❌ Never

```
axios.get(...)
```

 ### ✅ Correct

```
const result = await getEmployeesAction({
  page: 1,
  limit: 20,
});
```

 The UI communicates with the backend **only through Server Actions**.

---

 # 23\. Filtering & Search

 Filtering, fetching and state management belong to the Section View.

 Search fields should be debounced.

 Recommended behavior:

```
User types
   ↓
Raw input state
   ↓
~400ms debounce
   ↓
Server Action
   ↓
Backend
```

 Do not make a backend request on every keystroke unless explicitly required.

---

 # 24\. UI Conventions

 Use:

```
SharedTable
```

 from:

```
src/components/SharedTable/SharedTable
```

 and:

```
cellAlignment
```

 for table alignment.

 Use:

```
useToast()
```

 for success/error notifications.

 Use:

```
useTranslations('Namespace')
```

 for UI text.

 ### i18n

 Every new UI string MUST have keys in both:

```
messages/en.json
messages/ar.json
```

 Do not hardcode user-facing UI text when a translation key should be used.

---

 # 25\. Page

 Pages should remain thin.

 Example:

```
import SpecializationsView from '@/sections/specializations/view';

export default function SpecializationsPage() {
  return <SpecializationsView />;
}
```

 Do not put CRUD logic in the page unless there is an explicit architectural reason.

---

 # 26\. Sidebar

 Update:

```
src/components/Sidebar.tsx
```

 when adding a new dashboard feature.

 - Groups use `children`.
- Single items use `path`.
- Add required translation keys under the `Sidebar` namespace.
- Add translations to both locales.

---

 # 27\. Existing Reference Files

 Before implementing a new feature, the AI agent SHOULD inspect existing implementations.

 ### Server Actions

```
src/actions/auth.ts
src/actions/countries.ts
src/actions/specializations.ts
```

 ### Complex Server Action Reference

 If the new feature involves:

 - pagination
- query parameters
- CRUD
- nested response data
- FormData
- file upload
- update/delete
- complex request processing

 use the existing comprehensive Action implementations as architectural references.

 For example:

```
src/actions/employees.ts
```

 is a reference for **complete Server Action implementations**.

 ### Section CRUD

```
src/sections/countries/
```

 ### Types

```
src/types/crud-types.ts
src/types/specialization.ts
```

 ### HTTP layer

```
src/utils/crud-fetch-api.ts
```

 ### Endpoint registry

```
src/utils/endpoints.ts
```

 ### i18n

```
messages/en.json
messages/ar.json
src/i18n/config-locale.ts
```

---

 # 28\. AI AGENT IMPLEMENTATION CHECKLIST

 Before considering a feature complete, verify:

 ## Architecture

 - [ ] No `src/app/api/*` route was created.
- [ ] No direct backend `fetch` was added to UI.
- [ ] No axios call was added to UI.
- [ ] Backend communication goes through Server Actions.
- [ ] Server Actions use `crud-fetch-api.ts`.

 ## Server Actions

 - [ ] Every Action starts from `'use server';`.
- [ ] Every Action is a complete implementation, NOT a pass-through wrapper.
- [ ] Every Action has `try/catch`.
- [ ] Query parameters are actually constructed and sent.
- [ ] Request bodies are explicitly constructed where needed.
- [ ] `FormData` is used when required by the backend.
- [ ] Response success is explicitly validated.
- [ ] Response data is explicitly extracted/normalized.
- [ ] Errors return `{ success: false, error }`.
- [ ] `NEXT_REDIRECT` is not swallowed.
- [ ] Delete operations explicitly validate success.
- [ ] Create/update operations return the created/updated entity when available.
- [ ] List operations return normalized list/meta data when applicable.

 ## Types

 - [ ] Domain types are in `src/types/<domain>.ts`.
- [ ] Generic API types remain in `crud-types.ts`.
- [ ] Request and response types are explicit.

 ## UI

 - [ ] Section View is a client component.
- [ ] State lives in the Section View.
- [ ] Filtering