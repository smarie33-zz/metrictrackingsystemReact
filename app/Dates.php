<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Dates extends Model
{
    public static function scopeGetTheseDates($query){
    	return $query->select('id','date')->orderBy('date','ASC')->get();
    }

    public static function scopeGetOnlyDates($query){
    	$gottenDates = $query->select('date')->get();
    	$dateArray = [];
    	foreach($gottenDates as $gottenDate){
    		$dateArray[] = $gottenDate->date;
    	}
    	return $dateArray;
    }

    public static function scopeGetDateByDate($query, $date){
        return $query->where('date', $date);
    }
}
