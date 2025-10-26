

pour toutes les differentes fonctionnalites que je vais vous demander voici les instruction a suivre 

d abord vous allez cree le backend laravel avec cette process

si il y a des tables a cree cree donnee le moi en migration et pour les colonnes foreign key metter on delete cascade puis 
et annalyser bien les migrations existant pour ne pas trop s eloigner au conception de base 

cree moi sans model , le model doit contenir un boot qui va loader son id depuis un repository 

voici un exemple a suivre 

<?php

namespace App\Models\Util;

use App\Models\Utilisateur\Utilisateur;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Repositories\Util\NotificationRepository;

class Notification extends Model
{
    protected $table = 'IF_notification';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'id_receveur',
        'id_emetteur',
        'message',
        'statut',
        'date_envoi',
        'date_lecture',
        'erreur',
        'tentatives',
        'url_redirect'
    ];

    protected $casts = [
        'date_creation' => 'datetime',
        'date_envoi' => 'datetime',
        'date_lecture' => 'datetime',
        'tentatives' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = app(NotificationRepository::class)->generateNotificationId();
            }
        });
    }

    
    public function receveur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_receveur', 'id');
    }

    public function emetteur(): BelongsTo
    {
        return $this->belongsTo(Utilisateur::class, 'id_emetteur', 'id');
    }

    
    public function scopeNonLues($query)
    {
        return $query->where('statut', '!=', 'lu');
    }

    public function scopeParReceveur($query, $idReceveur)
    {
        return $query->where('id_receveur', $idReceveur);
    }
}


<?php

namespace App\Repositories\Util;

use App\Models\Util\Notification;

class NotificationRepository
{
    protected $model;

    public function __construct(Notification $model)
    {
        $this->model = $model;
    }

    public function generateNotificationId(): string
    {
        $lastNotification = $this->model->orderBy('id', 'desc')->first();
        $lastId = $lastNotification ? (int) substr($lastNotification->id, 6) : 0;
        return sprintf('NOTIF-%05d', $lastId + 1);
    }

    public function getNotificationsNonLues(string $idUtilisateur)
    {
        return $this->model
            ->parReceveur($idUtilisateur)
            ->nonLues()
            ->orderBy('date_creation', 'desc')
            ->get();
    }

    public function compterNonLues(string $idUtilisateur): int
    {
        return $this->model
            ->parReceveur($idUtilisateur)
            ->nonLues()
            ->count();
    }

    public function marquerCommeLue(string $idNotification): bool
    {
        $notification = $this->model->find($idNotification);
        
        if ($notification) {
            return $notification->update([
                'statut' => 'lu',
                'date_lecture' => now()
            ]);
        }
        
        return false;
    }

    public function tousMarquerCommeLue(string $idUtilisateur): bool
    {
        try {
            $updated = Notification::where('id_receveur', $idUtilisateur)
                ->where('statut', 'envoye')
                ->update(['statut' => 'lu', 'date_lecture' => now()]);

            return $updated > 0;
        } catch (\Exception $e) {
            return false;
        }
    }
}

tous ce qui est requette sql mettez les dans repositori , seule les logique metier reste sur le services 

puis vous creerai le service pour la fonctionnalite que je vous demanderai si je specifie pas le service ou mettre la fonctionnalite il faut en recree , 
et les fichier et mettre dans un dossier et a vous de trouver le nom correspondant au fichier et au dossier , vous pouvez aussi utliser des reportoire existnt si il eiste un chemin qui le categorie deja 
par exemple il y a deja un dossier app/Model/Caisse et si je demande un sevice etatdecaisse vous pouvez le mettre dans cette directori inclu pour toutes les model , service , repositorie , controller 

puis si appel le service dans un controller api  
et en fin cree moi le collection json pour le tester voici un model de collection json a  suivre utilise ceci comme model surtout sur les header il faut toujour utiliser ces headers


{
	"info": {
		"_postman_id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
		"name": "API Formules - Caisse",
		"description": "Tests pour la récupération du total des annonces actives par utilisateur",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "39761457"
	},
	"item": [
		{
			"name": "Get Total Active",
			"request": {
				"method": "GET",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json"
					},
					{
						"key": "Accept",
						"value": "application/json"
					},
					{
						"key": "Authorization",
						"value": "Bearer {{auth_token}}"
					},
					{
						"key": "X-Phone-Number",
						"value": "+261382010328",
						"type": "text"
					}
				],
				"url": {
					"raw": "{{base_url}}/caisse/formules/total-active?id_user=USR-00001",
					"host": [
						"{{base_url}}"
					],
					"path": [
						"caisse",
						"formules",
						"total-active"
					],
					"query": [
						{
							"key": "id_user",
							"value": "USR-00001",
							"description": "ID de l'utilisateur (requis, doit exister dans if_utilisateur)"
						}
					]
				},
				"description": "Récupère le total des annonces actives pour un utilisateur spécifique. Nécessite l'ID de l'utilisateur en paramètre de requête."
			},
			"response": []
		}
	],
	"variable": [
		{
			"key": "base_url",
			"value": "http://localhost:8000/api"
		},
		{
			"key": "auth_token",
			"value": "YOUR_AUTH_TOKEN"
		}
	]
}: 




puis vous l intregre suivant cette process 

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