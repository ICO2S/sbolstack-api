
function collateCounts(counts, res) {

    res.header('content-type', 'text/plain')

    var total = 0

    counts.forEach((count) => total += parseInt(count.body))

    res.send(total)
}

module.exports = collateCounts

