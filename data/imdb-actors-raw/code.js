const width = 600
const height = 400

const createSVGElement = (name) => {
    return document.createElementNS("http://www.w3.org/2000/svg", name)
}

const svg = createSVGElement("svg")
svg.setAttribute("width", width)
svg.setAttribute("height", height)

const id2node = {}
const size = 40
data.nodes.forEach((node) => {
    id2node[node.id] = node
    node.size = size
})

function scaleLinear(domain, range) {
    const ratio = (range[1] - range[0]) / (domain[1] - domain[0])
    return function (x) {
        return (x - domain[0]) * ratio + range[0]
    }
}

const xScale = scaleLinear([0, data.nodes.length], [width * 0.1, width * 0.9])
const yScale = scaleLinear([0, data.nodes.length], [height * 0.1, height * 0.9])

data.nodes
    .map((n, i) => ({ i, n }))
    .sort((a, b) => a.n.votes - b.n.votes)
    .forEach(({ n }, i) => {
        n.x = xScale(i)
    })

data.nodes
    .map((n, i) => ({ i, n }))
    .sort((a, b) => a.n.avg_vote - b.n.avg_vote)
    .forEach(({ n }, i) => {
        n.y = yScale(i)
    })

const linkGroup = createSVGElement("g")
linkGroup.setAttribute("stroke", "#00000055")
linkGroup.setAttribute("stroke-opacity", 0.6)

svg.appendChild(linkGroup)

data.links.forEach((link) => {
    const line = createSVGElement("line")
    linkGroup.appendChild(line)
    line.setAttribute("stroke-width", link["number_of_common_movies"] * 5)
    line.setAttribute("x1", id2node[link.source].x)
    line.setAttribute("y1", id2node[link.source].y)
    line.setAttribute("x2", id2node[link.target].x)
    line.setAttribute("y2", id2node[link.target].y)
})

const nodeGroup = createSVGElement("g")
svg.appendChild(nodeGroup)

const yearRange = [2016, 2020]
const numberOfMoviesByYearRange = [Infinity, -Infinity]
data.nodes.forEach((n) => {
    for (let year in n["number_of_movies_by_year"]) {
        const num = n["number_of_movies_by_year"][year]
        numberOfMoviesByYearRange[0] = Math.min(
            numberOfMoviesByYearRange[0],
            num
        )
        numberOfMoviesByYearRange[1] = Math.max(
            numberOfMoviesByYearRange[1],
            num
        )
    }
})

const lineXScale = scaleLinear(yearRange, [-size * 0.3, size * 0.3])
const lineYScale = scaleLinear(numberOfMoviesByYearRange, [
    size * 0.1,
    size * 0.4,
])

const lineChartsGroup = createSVGElement("g")
svg.appendChild(lineChartsGroup)

data.nodes.forEach((node) => {
    const g = createSVGElement("g")
    g.setAttribute("transform", `translate(${node.x}, ${node.y})`)
    lineChartsGroup.appendChild(g)

    const rect = createSVGElement("rect")
    g.appendChild(rect)
    rect.setAttribute("x", -node.size / 2)
    rect.setAttribute("y", -node.size / 2)
    rect.setAttribute("height", node.size)
    rect.setAttribute("width", node.size)
    rect.setAttribute("fill", "#ffffff")
    rect.setAttribute("stroke", "#000000")
    rect.setAttribute("stroke-width", "2.5")

    const text = createSVGElement("text")
    g.appendChild(text)
    const name = node.name
        .split(/[\s|-]/)
        .map((_) => _[0] + ".")
        .join(" ")
    text.setAttribute("y", -node.size * 0.4)
    text.setAttribute("text-anchor", "middle")
    text.setAttribute("alignment-baseline", "hanging")
    text.setAttribute("fill", "#000000")
    text.setAttribute("style", "font-size:10px;")
    text.textContent = name

    const barChartData = (d) => {
        const bars = Object.entries(d.number_of_movies_by_year).map(
            ([year, num]) => {
                return {
                    x: lineXScale(year),
                    y: 0, //lineYScale(numberOfMoviesByYearRange[1] - num),
                    width: size / 8,
                    height: lineYScale(num),
                }
            }
        )
        return bars
    }

    const barsData = barChartData(node)
    const rg = createSVGElement("g")
    g.appendChild(rg)
    rg.setAttribute(
        "transform",
        `scale(1, -1)translate(0, -${lineYScale(numberOfMoviesByYearRange[1])})`
    )
    barsData.forEach((bar) => {
        const rect = createSVGElement("rect")
        rg.appendChild(rect)
        rect.setAttribute("x", bar.x)
        rect.setAttribute("y", bar.y)
        rect.setAttribute("width", bar.width)
        rect.setAttribute("height", bar.height)
        // line.setAttribute("stroke", "red")
        // line.setAttribute("fill", "transparent")
        // line.setAttribute("stroke-width", 1.5)
        // line.setAttribute("stroke-linejoin", "round")
        // line.setAttribute("stroke-linecap", "round")
    })
})

return svg
