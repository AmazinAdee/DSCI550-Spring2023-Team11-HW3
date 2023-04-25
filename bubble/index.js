$(document).ready(function () {
    var bubbleChart = new d3.svg.BubbleChart({
        supportResponsive: true,
        //container: => use @default
        size: 600,
        //viewBoxSize: => use @default
        innerRadius: 600 / 3.5,
        //outerRadius: => use @default
        radiusMin: 50,
        //radiusMax: use @default
        //intersectDelta: use @default
        //intersectInc: use @default
        //circleColor: use @default
        data: {
            items: [
                { text: ".('-6.0', '72.0', 'British Indian Ocean Territory')", count: "1340" },
                { text: "('53.41667', '-2.25', 'Manchester')", count: "429" },
                { text: "('28.65195', '77.23149', 'Delhi')", count: "375" },
                { text: "('-25.0', '135.0', 'Commonwealth of Australia')", count: "208" },
                { text: "('33.0', '66.0', 'Islamic Republic of Afghanistan')", count: "207" },
                { text: "('39.76', '-98.5', 'United States')", count: "191" },
                { text: "('48.85341', '2.3488', 'Paris')", count: "190" },
                { text: "('40.4165', '-3.70256', 'Madrid')", count: "185" },
                { text: "('45.46427', '9.18951', 'Milan')", count: "163" },
                { text: "('26.0112', '-80.14949', 'Hollywood')", count: "158" },
            ],
            eval: function (item) { return item.count; },
            classed: function (item) { return item.text.split(" ").join(""); }
        },
        plugins: [
            {
                name: "lines",
                options: {
                    format: [
                        {// Line #0
                            textField: "count",
                            classed: { count: true },
                            style: {
                                "font-size": "28px",
                                "font-family": "Source Sans Pro, sans-serif",
                                "text-anchor": "middle",
                                fill: "white"
                            },
                            attr: {
                                dy: "0px",
                                x: function (d) { return d.cx; },
                                y: function (d) { return d.cy; }
                            }
                        },
                        {// Line #1
                            textField: "text",
                            classed: { text: true },
                            style: {
                                "font-size": "14px",
                                "font-family": "Source Sans Pro, sans-serif",
                                "text-anchor": "middle",
                                fill: "white"
                            },
                            attr: {
                                dy: "20px",
                                x: function (d) { return d.cx; },
                                y: function (d) { return d.cy; }
                            }
                        }
                    ],
                    centralFormat: [
                        {// Line #0
                            style: { "font-size": "50px" },
                            attr: {}
                        },
                        {// Line #1
                            style: { "font-size": "30px" },
                            attr: { dy: "40px" }
                        }
                    ]
                }
            }]
    });
});