//long-term this should take a record processor, which decides which records to pass to the renderer. 
//not sure what the name should be. Basically it's PersonAllocations. 
function DeltaRecords() {
  this.records = {};
}

DeltaRecords.prototype.addData = function(allocation) {
  this.records[allocation.id()] = this.records[allocation.id()] || [];
  this.records[allocation.id()].push(allocation);
}

DeltaRecords.prototype.render = function(renderer) {
  $.each(this.findDeltas(), function(index, record) {
    renderer.addRecord(record);
  });
  return renderer.render();
}

DeltaRecords.prototype.findDeltas = function() {
  var deltas = [];
  $.each(this.records, function(person_id, allocations) {
    var deltaRecord = new AllocationAnalyzer(allocations).deltaRecord();
    if (deltaRecord) {
      deltas.push(deltaRecord);
    }
  });
  return deltas;
}

