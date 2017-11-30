'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */

function runParallel(jobs, parallelNum, timeout = 1000) {

    let results = [];
    let startJobs = 0;
    let finishJobs = 0;

    return new Promise(resolve => {
        if (!jobs.length) {
            resolve(results);
        }
        while (startJobs < parallelNum) {
            workJob(startJobs++, resolve);
        }
    });

    function finishJobWithTimeout(indexJob) {
        return new Promise((timeResolve, timeReject) => {
            jobs[indexJob]()
                .then(timeResolve, timeReject);
            setTimeout(() => timeReject(new Error('Timeout')), timeout);
        });
    }

    function workJob(indexJob, resolve) {
        let jobResult = result => finishJob(result, indexJob, resolve);
        finishJobWithTimeout(indexJob).then(jobResult)
            .catch(jobResult);
    }

    function finishJob(result, indexJob, resolve) {
        results[indexJob] = result;
        finishJobs++;
        if (finishJobs === jobs.length) {
            resolve(result);
        } else if (startJobs < jobs.length) {
            workJob(startJobs++, resolve);
        }
    }


}
