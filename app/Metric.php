<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Metric extends Model
{
    public static function scopeGetMetrics($query){
    	return $query->select('id','name','type')->get();
    }
}
