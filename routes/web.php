<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', 'MetricsController@index');

Route::get('metrics', 'MetricsController@buildTable');

Route::post('save-metric','MetricsController@store');

Route::delete('delete-metric','MetricsController@destroy');