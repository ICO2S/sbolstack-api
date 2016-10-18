

var n = 0

function ExecutionTimer(description) {

    const num = ++ n

    console.log('[ExecutionTimer] #' + num + ': Started: ' + description)

    const begin = time()

    return () => {
        
        const delta = time() - begin

        console.log('[ExecutionTimer] #' + num + ': Finished: ' + description + ' (' + delta + ' ms)')

    }

}

function time() {

    return (new Date()).getTime()

}

module.exports = ExecutionTimer

