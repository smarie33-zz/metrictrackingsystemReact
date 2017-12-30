# metrictrackingsystemReact
laravel, react, sass for Pilot

+ laravel 5.5.25
+ react 15.4.2
+ node 8.9.1
+ npm 5.5.1

## structures edited/added
+ front end: 
++ resources > assets > js > components
++ resources > assets > js > sass
++ resources > views
++ routes
+back end:
++ .evn
++ package.json
++ database > migrations
++ app > [Models]
++ app > Http > Controllers
++ app > Http > Middleware

## interface functions
+ single page app updated dynamically via json and laravel api points
+ messages when the database is empty
+ view metrics in striped table
+ add metric and metric points to database
+ update metric points per metric
+ change metric names
+ delete entire metirc or specific metirc points
+ table dates are added as new metric points have new months and years
+ dates that have no metrics are removed from database
+ validation for decimals and numbers entries
+ validation for overlapping metric point dates
+ date formatting
+ error notifications

## set up
1. Install Laravel and composer if you do not have it [https://laracasts.com/series/laravel-from-scratch-2017/episodes/1](https://laracasts.com/series/laravel-from-scratch-2017/episodes/1)
2. Add Laravel folder to your valet directory
..+ cd into folder and run `valet link` if the localhost url does not work
3. Add database credentials to .env file
4. Run `php artisan migrate` to add tables to database

