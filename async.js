'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 */

function runParallel(jobs, parallelNum, timeout = 1000) {

    let results = jobs;
    let startJobs = 0;
    let finishJobs = 0;

    return new Promise(resolve => {
        if (!jobs.length) {
            resolve(results);
        }
        while (startJobs < parallelNum) {
            runJob(startJobs++, resolve);
        }
    });

    function finishJobWithTimeout(jobIndex) {
        return new Promise((timeResolve, timeReject) => {
            jobs[jobIndex]()
                .then(timeResolve, timeReject);
            setTimeout(() => timeReject(new Error('Promise timeout')), timeout);
        });
    }

    function runJob(indexJob, resolve) {
        let jobResult = result => finishJob(result, indexJob, resolve);

        return finishJobWithTimeout(indexJob).then(jobResult)
            .catch(jobResult);
    }

    function finishJob(result, jobIndex, resolve) {
        results[jobIndex] = result;
        finishJobs++;
        if (finishJobs === jobs.length) {
            resolve(results);
        } else if (startJobs < jobs.length) {
            runJob(startJobs++, resolve);
        }
    }


}
