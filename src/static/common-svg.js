"use strict";

var containerWidth = parseInt(container.style("width"));
var containerHeight = parseInt(container.style("height"));
var chartWidth = containerWidth - margin.left - margin.right;
var chartHeight = containerHeight - margin.top - margin.bottom;

var svg = container.append('svg').attr('width', chartWidth + margin.left + margin.right).attr('height', chartHeight + margin.top + margin.bottom);