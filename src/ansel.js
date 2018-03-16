var startOn = new Date(Date.parse($('input#start_on').val())).toISOString().split('T')[0];
var groupIds = $.makeArray($('input[name="group_ids"]').map(function() { return $(this).val(); }));
var locationIds = $.makeArray($('input[name="location_ids"]').map(function() { return $(this).val(); }));


$.getJSON("/api/timelines", {
  per_page: 100,
  start_on: startOn,
  number_of_weeks:2,
  group_ids: groupIds.join(','),
  location_ids: locationIds.join(','),
  page:1
},
function(data) {
  console.log(data);
});
