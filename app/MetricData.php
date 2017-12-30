<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MetricData extends Model
{
	protected $table = 'metrics_data';

    public static function scopeGetMetricsData($query, $metricID){
    	return $query->where('metric_id', $metricID);
    }

    public static function scopeGetOnlyMetricDates($query){
    	$gottenDates = $query->select('date')->get();
    	$dateArray = [];
    	foreach($gottenDates as $gottenDate){
    		$dateArray[] = $gottenDate->date;
    	}
    	return $dateArray;
    }

}
