const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()
const passport = require("passport")
require("../database/passportjs")(passport)

const createDOMPurify = require("dompurify")
const { JSDOM } = require("jsdom")

const window = new JSDOM("").window
const DOMPurify = createDOMPurify(window)

const datacontentmodel = require("../models/datacontentmodel")
const missioncontentmodel = require("../models/missioncontentmodel")
const responsecontentmodel = require("../models/responsecontentmodel")

const studentsConfig = require("../models/studentsconfig")
const studentmission = require("../models/studentmission")
const studentmanage = require("../models/studentmanage")
const studentminding = require("../models/studentminding")
const studentlistenconfig = require("../models/studentlistenconfig")

function converDangerString(string) {
    let clean = DOMPurify.sanitize(string)
    let outputString = []

    const converString = new Map([
        ["<", "&lt;"],
        [">", "&gt;"],
        ["&", "$amp;"],
        ['"', "&quot;"],
        ["'", "&#039;"],
    ])

    clean.split("").map(value => {
        converString.get(value) == undefined
            ? outputString.push(value)
            : outputString.push(converString.get(value))
    })
    return outputString.join("")
}

//學生取得 教學資料
router.post(process.env.ROUTER_STUDENT_READDATA, async (req, res) => {
    let thisWeekData
    let lastWeekPoint
    let isEmpty = false

    //取得當周資料
    await datacontentmodel
        .findOne({ session: req.user.studentSession, week: req.body.week })
        .then(response => {
            //若尚未新增則回傳無值
            if (response === null || response === undefined) {
                res.send("no found")
                isEmpty = true
                return
            }
            thisWeekData = response.content
        })
    //取得上週重點
    await datacontentmodel
        .findOne({ session: req.user.studentSession, week: req.body.week - 1 })
        .then(response => {
            if (response === null || response === undefined) {
                lastWeekPoint = ["無上週重點"]
                return
            }
            lastWeekPoint = [...response.content.thisWeekPoint]
        })
    const returnData = {
        thisWeekData: thisWeekData,
        lastWeekPoint: lastWeekPoint,
    }
    isEmpty ? null : res.send(returnData)
})
//學生取得 任務資料
router.post(process.env.ROUTER_STUDENT_READMISSION, async (req, res) => {
    //取得當周資料
    const missionData = missioncontentmodel
        .findOne({ session: req.user.studentSession, week: req.body.week })
        .exec()
    const studentData = studentmission
        .findOne({
            session: req.user.studentSession,
            week: req.body.week,
            studentId: req.user.studentId,
        })
        .exec()
    let returnData = {
        mission: [],
        studentSelect: {},
    }
    let isEmpty = false

    //取得本周目標
    await missionData.then(response => {
        if (response === null || response === undefined) {
            res.send("no found")
            isEmpty = true
        } else {
            returnData.mission = response.mission
        }
    })
    //取得本周已選項目
    await studentData.then(response => {
        if (response === null || response === undefined) {
            returnData.studentSelect = null
        } else {
            returnData.studentSelect = response.studentSelect
        }
    })
    isEmpty ? null : res.send(returnData)
})
//學生取得 Manage資料
router.post(process.env.ROUTER_STUDENT_READMANAGE, async (req, res) => {
    let isEmpty = false

    studentmanage
        .findOne({
            session: req.user.studentSession,
            week: req.body.week,
            studentId: req.user.studentId,
        })
        .then(response => {
            if (response === null || response === undefined) {
                res.send("no found")
                isEmpty = true
            } else {
                res.send({ studentManage: response.studentManage })
            }
        })
})
//學生取得 Minding資料
router.post(process.env.ROUTER_STUDENT_READMINDING, async (req, res) => {
    let isEmpty = false

    studentminding
        .findOne({
            session: req.user.studentSession,
            week: req.body.week,
            studentId: req.user.studentId,
        })
        .then(response => {
            if (response === null || response === undefined) {
                res.send("no found")
                isEmpty = true
            } else {
                res.send(response)
            }
        })
})
//學生取得 Response 資料
router.post(process.env.ROUTER_STUDENT_READRESPONSE, async (req, res) => {
    responsecontentmodel
        .findOne({
            session: req.user.studentSession,
            week: req.body.week,
            studentId: req.user.studentId,
        })
        .then(response => {
            res.send(response)
        })
})

//學生寫入 Mission 資料 （包含建置 Manage Minding)
router.post(process.env.ROUTER_STUDENT_ADDMISSION, async (req, res) => {
    let isEmpty = false
    let isMissionComplete = false
    let isManageComplete = false
    let isMindingComplete = false

    if (
        req.body.week == undefined ||
        req.user.studentId == undefined ||
        req.body.studentSelect == {}
    ) {
        res.send("data error")
        isEmpty = true
    }

    if (!isEmpty) {
        await studentmission
            .findOne({
                session: req.user.studentSession,
                studentId: req.user.studentId,
                week: req.body.week,
            })
            .then(async response => {
                //若尚未新增過該周
                if (response === null || response === undefined) {
                    const newStudentMission = new studentmission({
                        session: req.user.studentSession,
                        studentId: req.user.studentId,
                        week: req.body.week,
                        studentSelect: req.body.studentSelect,
                    })
                    newStudentMission.save()
                    isMissionComplete = true
                }
                //若已新增過該周
                else {
                    await studentmission
                        .updateOne(
                            {
                                session: req.user.studentSession,
                                studentId: req.user.studentId,
                                week: req.body.week,
                            },
                            { studentSelect: req.body.studentSelect }
                        )
                        .then(response => {
                            isMissionComplete = response.acknowledged
                        })
                }
            })

        if (req.body.manageCheck == true) {
            await studentmanage
                .findOne({
                    session: req.user.studentSession,
                    studentId: req.user.studentId,
                    week: req.body.week,
                })
                .then(async response => {
                    //若尚未新增過該周
                    if (response === null || response === undefined) {
                        const newStudentManage = new studentmanage({
                            session: req.user.studentSession,
                            studentId: req.user.studentId,
                            week: req.body.week,
                            studentManage: req.body.studentSelect,
                        })
                        newStudentManage.save()
                        isManageComplete = true
                    }
                    //若已新增過該周
                    else {
                        await studentmanage
                            .updateOne(
                                {
                                    session: req.user.studentSession,
                                    studentId: req.user.studentId,
                                    week: req.body.week,
                                },
                                { studentManage: req.body.studentSelect }
                            )
                            .then(response => {
                                isManageComplete = response.acknowledged
                            })
                    }
                })

            const mindingSelect = Object.values(req.body.studentSelect)
            let mindingData = {}

            mindingSelect.map((value, index) => {
                mindingData[value[0]] = {
                    missionName: value[0],
                    missionComplete: false,
                    missionReason: "",
                }
            })

            await studentminding
                .findOne({
                    session: req.user.studentSession,
                    studentId: req.user.studentId,
                    week: req.body.week,
                })
                .then(async response => {
                    //若尚未新增過該周
                    if (response === null || response === undefined) {
                        const newStudentMinding = new studentminding({
                            session: req.user.studentSession,
                            studentId: req.user.studentId,
                            week: req.body.week,
                            studentMinding: mindingData,
                            studentFixing: "",
                            studentRanking: "",
                        })
                        newStudentMinding.save()
                        isMindingComplete = true
                    }
                    //若已新增過該周
                    else {
                        await studentminding
                            .updateOne(
                                {
                                    session: req.user.studentSession,
                                    studentId: req.user.studentId,
                                    week: req.body.week,
                                },
                                {
                                    studentMinding: mindingData,
                                    studentFixing: "",
                                    studentRanking: "",
                                }
                            )
                            .then(response => {
                                isMindingComplete = response.acknowledged
                            })
                    }
                })

            res.send(isMindingComplete)
        }
        req.body.manageCheck == true ? null : res.send(isMissionComplete)
    }
})
//學生寫入 Manage 資料
router.post(process.env.ROUTER_STUDENT_ADDMANAGE, async (req, res) => {
    const cloud = studentmanage
        .findOne({
            session: req.user.studentSession,
            week: req.body.week,
            studentId: req.user.studentId,
        })
        .exec()
    let cloudData

    await cloud.then(response => {
        cloudData = Object.values(response.studentManage)
    })

    cloudData[req.body.manageId][req.body.manageStep] = converDangerString(
        req.body.manageContent
    )

    await studentmanage
        .updateOne(
            {
                session: req.user.studentSession,
                week: req.body.week,
                studentId: req.user.studentId,
            },
            { studentManage: cloudData }
        )
        .then(response => {
            res.send(response.acknowledged)
        })
})
//學生寫入 Minding 資料
router.post(process.env.ROUTER_STUDENT_ADDMINDING, async (req, res) => {
    let Minding = Object.values(req.body.studentMinding)

    Minding.map((value, index) => {
        Minding[index].missionReason = converDangerString(value.missionReason)
    })
    Minding = Object.assign({}, Minding)
    studentminding
        .updateOne(
            {
                session: req.user.studentSession,
                studentId: req.user.studentId,
                week: req.body.week,
            },
            {
                studentMinding: Minding,
                studentRanking: req.body.studentRanking,
                studentFixing: converDangerString(req.body.studentFixing),
            }
        )
        .then(response => {
            res.send(response.acknowledged)
        })
})
//學生寫入 Response 資料
router.post(process.env.ROUTER_STUDENT_ADDRESPONSE, async (req, res) => {
    responsecontentmodel
        .updateOne(
            {
                session: req.user.studentSession,
                studentId: req.user.studentId,
                week: req.body.week,
            },
            {
                studentResponse: converDangerString(req.body.studentResponse),
                studentResponseTime: req.body.studentResponseTime,
            }
        )
        .then(response => {
            res.send(response.acknowledged)
        })
})
//學生更改密碼
router.post(process.env.ROUTER_STUDENT_CHANGEPASSWORD, async (req, res) => {
    const saltRound = 15
    bcrypt.hash(req.body.newPassword, saltRound, (err, hashedPassword) => {
        bcrypt
            .compare(req.body.oldPassword, req.user.studentPassword)
            .then(async response => {
                if (response) {
                    await studentsConfig
                        .updateOne(
                            {
                                studentId: req.user.studentId,
                                studentAccess: true,
                            },
                            { studentPassword: hashedPassword }
                        )
                        .then(response => {
                            res.send(response.acknowledged)
                        })
                } else {
                    res.send("舊密碼不正確")
                }
            })
    })
})

//監聽學生輸入
router.post(process.env.ROUTER_STUDENT_ADDLISTENER, async (req, res) => {
    await studentlistenconfig
        .findOne({
            session: req.user.studentSession,
            studentId: req.user.studentId,
        })
        .then(async response => {
            if (response == null) {
                const newListenerContent = new studentlistenconfig({
                    session: req.user.studentSession,
                    studentId: req.user.studentId,
                    studentMonitor: req.body.clickTemp,
                })

                newListenerContent.save()
            } else {
                const newData = [...response.studentMonitor, req.body.clickTemp]

                await studentlistenconfig.updateOne(
                    {
                        session: req.user.studentSession,
                        studentId: req.user.studentId,
                    },
                    { studentMonitor: newData }
                )
            }
            res.send("success")
        })
})

module.exports = router
