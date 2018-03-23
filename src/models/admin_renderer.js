function AdminRenderer(locationMap, projectMap) {
  this.locationMap = locationMap || new MapFactory({});
  this.projectMap = projectMap || new MapFactory({});
  this.result = {}

}

//TODO: opportunity here to have a base renderer that handles record adding.
AdminRenderer.prototype.addRecord = function(record) {
  if (record.type() != "rotation") {
    return;
  }
  if (record.leavingProject.id) {
    this.result[record.leavingProject.id] = this.result[record.leavingProject.id] || new AdminProjectDeltas(record.leavingProject);
    this.result[record.leavingProject.id].leaving.push(record);
  }
  if (record.joiningProject.id) {
    this.result[record.joiningProject.id] = this.result[record.joiningProject.id] || new AdminProjectDeltas(record.joiningProject);
    this.result[record.joiningProject.id].joining.push(record);
  }
}

AdminRenderer.prototype.render = function() {
  var sections = [];
  $.each(this.result, function(k, project_delta) {
    var projectSection = ["<strong>" + project_delta.project.name + "</strong>"];
    if (project_delta.leaving.length > 0) {
      projectSection.push("<i>Leaving</i>");
      $.each(project_delta.leaving, function(index, record) {
        projectSection.push(record.person.name);
      });
    }
    if (project_delta.joining.length > 0) {
      projectSection.push("<i>Joining</i>");
      $.each(project_delta.joining, function(index, record) {
        projectSection.push(record.person.name);
      });
    }
    sections.push(projectSection.join("<br />"));
  })
  return sections.join("<br /><br />");
}

AdminRenderer.prototype.content_type = function() {
  return "data:text/html,";
}

function AdminProjectDeltas(project) {
  this.project = project;
  this.leaving = [];
  this.joining = [];
}

