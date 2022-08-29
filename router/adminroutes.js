const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../database/passportjs')(passport)

const studentsConfig = require('../models/studentsconfig')

const datacontentmodel = require('../models/datacontentmodel')
const missioncontentmodel = require('../models/missioncontentmodel')
const responsecontentmodel = require('../models/responsecontentmodel')

const studentmission = require('../models/studentmission')
const studentmanage = require('../models/studentmanage')
const studentminding = require('../models/studentminding')

router.use((req, res, next)=>{
    if(req.user != undefined){
        if(req.user.studentId == "admin"){
            next()
            return
        }
        res.send("fall")
    }else{
        res.send("fall")
    }
})

router.post(process.env.ROUTER_ADMIN_READSTUDENTSTATUS,async(req,res)=>{
    const returnData = {
        studentsStatus:[],
        studentsMinding:[],
        studentsResponse:[]
    }
    
    await studentsConfig.find({}).then(response=>{
        response.map((value,index)=>{
            if(value.studentName != 'Admin'){
                returnData.studentsStatus.push(value.studentDetail)
            }
        })
    })
    await studentminding.find({}).then(response=>{
        response.map((value,index)=>{
            const mindingData = {
                studentMinding: value.studentMinding,
                studentRanking: value.studentRanking
            }
            returnData.studentsMinding.push(mindingData)
        })
    })
    await responsecontentmodel.find({}).then(response=>{
        response.map((value,index)=>{
            const responseData={
                studentId : value.studentId,
                week: value.week,
                studentResponse:value.studentResponse,
                teacherResponse:value.teacherResponse
            }
            returnData.studentsResponse.push(responseData)
        })
    })

    res.send(returnData)
})

router.post(process.env.ROUTER_ADMIN_ADDSTUDENT,async (req,res)=>{   
    const saltRound = 15
    bcrypt.hash(req.body.studentPassword, saltRound,(err,hashedPassword)=>{
        const studentDetailInit = new Array()
        const availableWeek = 7

        for(let i = 1;i<= availableWeek;i++){
            studentDetailInit.push({
                Week: i ,
                Status:{
                    Data:false,
                    Mission:false,
                    Manage:false,
                    Minding:false,
                    Response:false
                }
            })
        }

        const newStudent = new studentsConfig({
            studentId: req.body.studentId,
            studentPassword: hashedPassword,
            studentName:req.body.studentName,
            studentEmail: req.body.studentEmail,
            studentDetail: studentDetailInit
        })
        newStudent.save()
        res.send('success')
    })
        

    
})

router.post(process.env.ROUTER_ADMIN_ADDDATA,async (req,res)=>{
    const addWeek = req.body.week
    const checkWeek =  datacontentmodel.findOne({week:addWeek})

    await checkWeek.then(isAdded=>{
        try{
            //若尚未新增該周資料
            if (isAdded === null) {
                const newWeekData = new datacontentmodel({
                    week: addWeek,
                    content: req.body.content
                })
                newWeekData.save()
            }
            //已經新增過，欲進行更改
            else {
                datacontentmodel.updateOne({ week: addWeek},{content: req.body.content }).then(result=>{
                    console.log(result)
                })
            }
        }catch{
            console.log("mongodb has error")
        }   
    })
    res.send('success')
})

router.post(process.env.ROUTER_ADMIN_ADDMISSION,async(req,res)=>{
    const addWeek = req.body.week
    const checkWeek = missioncontentmodel.findOne({week:addWeek})

    await checkWeek.then(isAdded=>{
        try{
            if(isAdded === null){
                const newWeekMission = new missioncontentmodel({
                    week:addWeek,
                    mission: req.body.mission
                })
                newWeekMission.save()
            }else{
                missioncontentmodel.updateOne({week:addWeek},{mission:req.body.mission}).then(result=>{
                    console.log(result)
                })
            }
        }
        catch{
            console.log("mongodb has error")
        }
    })
    res.send('success')
})

router.post(process.env.ROUTER_ADMIN_ADDRESPONSE, async (req, res) => {

})

module.exports = router