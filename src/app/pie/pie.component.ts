import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

export interface dataset_i {
  name: string;
  value: number;
}

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css'],
})
export class PieComponent implements AfterViewInit {
  constructor() {}
  // height
  h: number = 0;
  // width
  w: number = 0;
  // padding (each side has 1rem padding) 1rem = 16px
  p: number = 32;
  // this.r of the pie
  r: number = 0;
  // color palettes
  palette: string[] = ['#3886A4', '#6EBE9F', '#C73858', '#F3A935'];

  dataset: Array<dataset_i> = [
    { name: 'August', value: 24 },
    { name: 'September', value: 12 },
    { name: 'October', value: 74 },
    { name: 'November', value: 44 },
  ];

  ngOnInit(): void {
    // setting height to parent ele - padding
    this.h =
      document.getElementsByClassName('chart_container')[0].clientHeight -
      this.p;
    // setting width to parent ele - padding
    this.w =
      document.getElementsByClassName('chart_container')[0].clientWidth -
      this.p;
    // dynamically generating radius from parent nodes
    this.r = Math.min(this.w, this.h) / 2 - this.p / 2;
  }

  ngAfterViewInit(): void {
    // select svg tag, add attributes (h,w) and move coordinates origin to center
    let svg = d3
      .select('#pie')
      .attr('height', this.h)
      .attr('width', this.w)
      .append('g')
      .attr('transform', `translate(${this.w / 2},${this.h / 2})`);
    // generate a pie
    const pie = d3
      .pie<dataset_i>()
      .value((d: dataset_i) => d.value)
      .sort(null);

    var arc = d3
      .arc()
      .innerRadius(this.r * 0.8 - this.p)
      .outerRadius(this.r * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3
      .arc()
      .innerRadius(this.r * 0.8)
      .outerRadius(this.r * 0.8 + this.p);

    // Add the polylines between chart and labels:
    svg
      .selectAll('allPolylines')
      .data(pie(this.dataset))
      .enter()
      .append('polyline')
      .attr('stroke', '#343434')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', (d: any): any => {
        var posA = arc.centroid(d);
        var posB = outerArc.centroid(d);
        var posC = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = this.r * 0.9 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
      });
    svg
      .selectAll('allLabels')
      .data(pie(this.dataset))
      .enter()
      .append('text')
      .text((d) => d.value)
      .attr('transform', (d: any) => {
        var pos = outerArc.centroid(d);
        // var pos = outerRadius.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.r * 0.88 * (midangle < Math.PI ? 1 : -1);
        return 'translate(' + pos + ')';
      })
      .style('text-anchor', function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      });
    // creating arcs/pie segements
    var arcs = svg
      .selectAll('path')
      .data(pie(this.dataset))
      .enter()
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (d, i) => this.palette[i])
      .attr('stroke', '#eaeaea')
      .attr('class', 'portion')
      .attr('id', (d, i) => `portion${i}`)
      .style('stroke-width', '4px');
  }
}
