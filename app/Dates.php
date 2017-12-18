<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Dates extends Model
{
    public static function scopeGetTheseDates($query){
    	return $query->select('id','date')->get();
    }

    public static function scopeGetOnlyDates($query){
    	$gottenDates = $query->select('date')->get();
    	$dateArray = array();
    	foreach($gottenDates as $gottenDate){
    		$dateArray[] = $gottenDate->date;
    	}
    	return $dateArray;
    }
}
