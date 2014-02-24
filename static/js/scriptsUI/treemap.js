var w = $('#buble_chart').width(), h = $(window).height() - (($(window).height()) * 0.2), x = d3.scale.linear().range([0, w]), y = d3.scale.linear().range([0, h]), color = d3.scale.category20c(), root, node;

var r = w > h ? h : w, x = d3.scale.linear().range([0, r]), y = d3.scale.linear().range([0, r]), node, root;

var pack = d3.layout.pack().size([r, r]).value(function(d) {
	return d.cpu_util_percent;
});
var vis = d3.select('#buble_chart').insert("svg:svg", "h2").attr("width", w).attr("height", h).append("svg:g").attr("transform", "translate(" + (w - r) / 2 + "," + (h - r) / 2 + ")");



d3.json("static/example.json", function(data) {
	node = root = data;

	var nodes = pack.nodes(root);

	vis.selectAll("circle").data(nodes).enter().append("svg:circle").attr("class", function(d) {
		return d.children ? "parent" : "child";
	}).attr("cx", function(d) {
		return d.x;
	}).attr("cy", function(d) {
		return d.y;
	}).attr("r", function(d) {
		return d.r;
	}).on("click", function(d) { return zoom(node == d ? root : d); })
	.attr('id',function(d){
			return typeof d.resource_id == 'undefined' ? d.name: d.resource_id;
	});

	vis.selectAll("text").data(nodes).enter().append("svg:text").attr("class", function(d) {
		return d.children ? "parent" : "child";
	}).attr("x", function(d) {
		return d.x;
	}).attr("y", function(d) {
		return d.y;
	}).attr("dy", ".35em").attr("text-anchor", "middle").style("opacity", function(d) {
		return d.r > 20 ? 1 : 0;
	}).text(function(d) {
		console.log(d.resource_id);
		
		return typeof d.resource_id == 'undefined' ? d.name: d.resource_id;
	}).attr("resource_id",d.resource_id);

	d3.select(window).on("click", function() {
		zoom(root);
	});
});

$('.circle').on("dbclick",function(d){alert(this.id);});

function zoom(d, i) {
	var k = r / d.r / 2;
	x.domain([d.x - d.r, d.x + d.r]);
	y.domain([d.y - d.r, d.y + d.r]);

	var t = vis.transition().duration(d3.event.altKey ? 7500 : 750);

	t.selectAll("circle").attr("cx", function(d) {
		return x(d.x);
	}).attr("cy", function(d) {
		return y(d.y);
	}).attr("r", function(d) {
		return k * d.r;
	});

	t.selectAll("text").attr("x", function(d) {
		return x(d.x);
	}).attr("y", function(d) {
		return y(d.y);
	}).style("opacity", function(d) {
		return k * d.r > 20 ? 1 : 0;
	});

	node = d;
	d3.event.stopPropagation();
}