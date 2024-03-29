const width = 500
const height = 400
const links = data.links
const nodes = data.nodes

const colors = d3.schemeCategory10

const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)

const nodeID2node = {}
const budgetRange = { min: Infinity, max: -Infinity }
const incomeRange = { min: Infinity, max: -Infinity }

const forceLayout = {
    52267: { x: 292.7110308782953, y: 107.8066618304493 },
    52365: { x: 254.80319272057346, y: 121.26645995264455 },
    52434: { x: 309.50620887831496, y: 244.66543563059864 },
    52511: { x: 344.39842675518975, y: 239.43536487269944 },
    52513: { x: 328.6191863984587, y: 278.48343946092456 },
    52527: { x: 215.25708794317086, y: 289.874945549475 },
    52532: { x: 261.52563893106867, y: 315.14993744508405 },
    52567: { x: 253.96098371673554, y: 225.05363698467787 },
    52568: { x: 288.3006565008802, y: 228.2179518274109 },
    52675: { x: 296.4151140095169, y: 177.23565745944953 },
    52707: { x: 308.94262390167523, y: 146.00675775015492 },
    52780: { x: 254.27441085556563, y: 264.966198965922 },
    53072: { x: 269.3595616215715, y: 275.0961270694078 },
    53180: { x: 217.25349221808443, y: 254.80123979171302 },
    53182: { x: 233.76145260867236, y: 122.72628054644326 },
    53230: { x: 313.4015434835095, y: 201.38374634224778 },
    53396: { x: 240.34361076245528, y: 302.3473347021299 },
    54087: { x: 162.67900157709934, y: 238.4425674914806 },
    54223: { x: 262.1930552556268, y: 202.89136135223967 },
    54299: { x: 350.6273303616858, y: 271.8787669783303 },
    64296: { x: 197.51873707753333, y: 127.63261471683457 },
    72484: { x: 345.65142667110507, y: 133.45258528055885 },
    73568: { x: 148.41940687586774, y: 235.83732315022934 },
    80023: { x: 294.3478788904486, y: 136.21352124651224 },
    80584: { x: 315.70356621077195, y: 98.59596026825797 },
    80938: { x: 53.37901419347585, y: 189.35082154814194 },
    80950: { x: 178.63585821109305, y: 78.67638250038391 },
    80977: { x: 241.33826246407395, y: 252.42936320596652 },
    82873: { x: 301.0561252627607, y: 196.36156926292944 },
    82904: { x: 363.5558527957114, y: 201.43300909523805 },
    83204: { x: 174.69516888432904, y: 171.00938963544687 },
    83339: { x: 155.83940661385228, y: 94.25491359816561 },
    83447: { x: 269.63714569621123, y: 154.0697979937053 },
    83970: { x: 256.9057436733738, y: 100.90897056162952 },
    84943: { x: 385.1432919395075, y: 224.80514468075614 },
    85253: { x: 243.50083002861274, y: 158.29283379561014 },
    85257: { x: 89.53881850267967, y: 210.1862885457 },
    85295: { x: 252.06818759749862, y: 354.11128957631877 },
    85415: { x: 152.40462728896378, y: 210.90835842602948 },
    85429: { x: 251.2366239826555, y: 80.59215195499866 },
    85574: { x: 334.69492404385494, y: 219.06936127609015 },
    85577: { x: 235.12115235909056, y: 194.29810922597719 },
    85581: { x: 135.74979591532832, y: 164.69121240958847 },
    85582: { x: 187.57929682198198, y: 247.55264769336924 },
    85624: { x: 345.0521719052311, y: 177.02749358006443 },
    85641: { x: 287.83362416772565, y: 164.93674365356358 },
    85656: { x: 142.2389694466525, y: 148.46923953689617 },
    85671: { x: 271.9051365839451, y: 353.5426457118844 },
    85680: { x: 187.48327757686312, y: 214.9789482979163 },
}

nodes.forEach((node) => {
    nodeID2node[node.id] = node
    node.x = forceLayout[node.id].x
    node.y = forceLayout[node.id].y
    incomeRange.min = Math.min(node.worlwide_gross_income, incomeRange.min)
    incomeRange.max = Math.max(node.worlwide_gross_income, incomeRange.max)
    budgetRange.min = Math.min(node.budget, budgetRange.min)
    budgetRange.max = Math.max(node.budget, budgetRange.max)
})

const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => d.common_actors * 5)
    .attr("x1", (d) => nodeID2node[d.source].x)
    .attr("y1", (d) => nodeID2node[d.source].y)
    .attr("x2", (d) => nodeID2node[d.target].x)
    .attr("y2", (d) => nodeID2node[d.target].y)

const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 8)
    .attr("fill", (d) => {
        const month = d.date_published.month
        const season = Math.floor((month - 1) / 3)
        return colors[season]
    })
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)

node.append("title").text((d) => d.title)
return svg.node()
