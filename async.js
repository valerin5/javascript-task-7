'use strict';

exports.isStar = true;
exports.runParallel = runParallel;

/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 */

function runParallel(jobs, parallelNum, timeout = 1000) {
    let results = [];
    let startJobs = 0;
    let finishJobs = 0;

    return new Promise(resolve => {
        if (!jobs.length) {
            resolve(results);
        }
        for (let i = 0; i < parallelNum; i++) {
            workJob(i, resolve);
        }
    });

    function finishJobWithTimeout(indexJob) {
        return new Promise((timeResolve, timeReject) => {
            jobs[indexJob]().then(timeResolve, timeReject);
            setTimeout(() => timeReject(new Error('Timeout')), timeout);
        });
    }

    function finishJob(result, indexJob, resolve) {
        results[indexJob] = result;
        finishJobs = finishJobs + 1;
        if (finishJobs === jobs.length) {
            resolve(result);
        } else if (startJobs < finishJobs) {
            startJobs = startJobs + 1;
            workJob(startJobs, resolve);
        }
    }

    function workJob(indexJob, resolve) {
        let jobResult = result => finishJob(result, indexJob, resolve);
        finishJobWithTimeout(indexJob).then(jobResult)
            .catch(jobResult);
    }

}
