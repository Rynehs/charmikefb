<?php

use App\Http\Controllers\Admin\AgentController as AdminAgentController;
use App\Http\Controllers\Admin\ClientController as AdminClientController;
use App\Http\Controllers\Admin\LoanController as AdminLoanController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Agent\ClientController as AgentClientController;
use App\Http\Controllers\Agent\LoanController as AgentLoanController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Client\LoanController as ClientLoanController;
use App\Http\Controllers\Client\ProfileController as ClientProfileController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\DashboardController;

/*
|--------------------------------------------------------------------------
| Public Auth Routes
|--------------------------------------------------------------------------
*/

Route::post('/admin/login',    [AuthController::class, 'adminLogin']);
Route::post('/agent/login',    [AuthController::class, 'agentLogin']);
Route::post('/client/register', [AuthController::class, 'clientRegister']);
Route::post('/client/login',   [AuthController::class, 'clientLogin']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |----------------------------------------------------------------------
    | Admin Routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {

        //Dashboard
        Route::get('dashboard', [DashboardController::class, 'index']);

        // Agent management
        Route::get('agents',                         [AdminAgentController::class, 'index']);
        Route::post('agents',                        [AdminAgentController::class, 'store']);
        Route::get('agents/{agent}',                 [AdminAgentController::class, 'show']);
        Route::put('agents/{agent}',                 [AdminAgentController::class, 'update']);
        Route::patch('agents/{agent}/activate',      [AdminAgentController::class, 'activate']);
        Route::patch('agents/{agent}/deactivate',    [AdminAgentController::class, 'deactivate']);
        Route::delete('agents/{agent}',              [AdminAgentController::class, 'destroy']);
      

        // Client management
        Route::get('clients',        [AdminClientController::class, 'index']);
        Route::get('clients/{id}',   [AdminClientController::class, 'show']);

        // Loan management
        Route::get('loans',                          [AdminLoanController::class, 'index']);
        
        Route::get('loans/pending',                  [AdminLoanController::class, 'pending']);
        Route::get('loans/{id}',                     [AdminLoanController::class, 'show']);
        Route::post('loans/{id}/approve',            [AdminLoanController::class, 'approve']);
        Route::post('loans/{id}/reject',             [AdminLoanController::class, 'reject']);
        Route::post('loans/{id}/disburse',           [AdminLoanController::class, 'disburse']);

        // Reports & settings
        Route::get('reports/dashboard',              [AdminReportController::class, 'dashboard']);
        Route::get('reports/commissions',            [AdminReportController::class, 'commissions']);
        Route::get('settings',                       [AdminReportController::class, 'settings']);
        Route::put('settings',                       [AdminReportController::class, 'updateSettings']);
    });

    /*
    |----------------------------------------------------------------------
    | Agent Routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:agent')->prefix('agent')->group(function () {
        Route::get('dashboard',        [AgentLoanController::class, 'dashboard']);
        Route::get('clients',          [AgentClientController::class, 'index']);
        Route::get('clients/{id}',     [AgentClientController::class, 'show']);
        Route::get('loans',            [AgentLoanController::class, 'index']);
        Route::get('loans/{id}',       [AgentLoanController::class, 'show']);
        Route::get('commissions',      [AgentLoanController::class, 'commissions']);
    });

    /*
    |----------------------------------------------------------------------
    | Client Routes
    |----------------------------------------------------------------------
    */
    Route::middleware('role:client')->prefix('client')->group(function () {
        Route::get('profile',          [ClientProfileController::class, 'show']);
        Route::put('profile',          [ClientProfileController::class, 'update']);
        Route::get('loans/active',     [ClientLoanController::class, 'active']);
        Route::get('loans',            [ClientLoanController::class, 'index']);
        Route::post('loans',           [ClientLoanController::class, 'store']);
        Route::get('loans/{id}',       [ClientLoanController::class, 'show']);
    });

    /*
    |----------------------------------------------------------------------
    | Shared Payment Routes (admin + agent can record; all can view own)
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin,agent')->post('payments', [PaymentController::class, 'store']);
    Route::middleware('role:admin,agent,client')->get('payments', [PaymentController::class, 'index']);
});
