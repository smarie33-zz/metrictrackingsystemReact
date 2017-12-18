<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MetricData extends Model
{
	protected $table = 'metrics_data';

    public static function scopeGetMetricsData($query, $metricID){
    	return $query->where('metric_id', $metricID);
    }

}
