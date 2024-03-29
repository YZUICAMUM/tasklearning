//渲染每周Stage
const renderWeekTaskManager = (week, stage) => {
    let Model = ""
    //外圈收尾
    const taskEnd = "</div>"

    //task之間連接線
    const taskArrow =
        '<img class="taskArrow" src="../../media/img/arrow-gif.gif" alt="arrowRight"/>'

    //task外圈
    let taskOutlineStart
    for (let i = 0; i < stage.length; i++) {
        if (stage[i] === false || stage[i] === 1) {
            taskOutlineStart = '<div class="taskContent">'
            break
        } else {
            taskOutlineStart = '<div class="taskContent_complete">'
        }
    }

    //task之week
    const taskWeekTitle = `<div class="taskWeekTitle" id="week_${week}"><h1> Progress ${week}</h1><div class="taskProgress" id="taskProgress_${week}"></div><h3 class="taskProgressText" id="taskProgressText_${week}"></h3></div>`

    //task middle
    const taskMiddle = `<div class="taskMiddle" id="taskMiddle_${week}">`

    //task 進度stage外圈
    const taskStageStart = `<div class="taskStage">`

    //task 完成Icon
    const taskCompleteIcon =
        '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">' +
        '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />' +
        '<path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />' +
        "</svg>"

    //Stage 1教學資料
    const taskStage_Data_uncomplete =
        `<div class="taskStage_Box" id="Data_${week}">` +
        "<h4>教學資料</h4>" +
        taskEnd

    const taskStage_Data_complete =
        `<div class="taskStage_Box_Complete" id="Data_${week}">` +
        "<h4>教學資料</h4>" +
        taskCompleteIcon +
        taskEnd

    //Stage 2本周目標
    const taskStage_Mission_uncomplete =
        `<div class="taskStage_Box" id="Mission_${week}">` +
        "<h4>準備階段</h4>" +
        taskEnd

    const taskStage_Mission_complete =
        `<div class="taskStage_Box_Complete" id="Mission_${week}">` +
        "<h4>準備階段</h4>" +
        taskCompleteIcon +
        taskEnd

    //Stage 3學習計畫
    const taskStage_Manage_uncomplete =
        `<div class="taskStage_Box" id="Manage_${week}">` +
        "<h4>執行階段</h4>" +
        taskEnd

    const taskStage_Manage_complete =
        `<div class="taskStage_Box_Complete" id="Manage_${week}">` +
        "<h4>執行階段</h4>" +
        taskCompleteIcon +
        taskEnd

    //Stage 4自我反思
    const taskStage_Minding_uncomplete =
        `<div class="taskStage_Box" id="Minding_${week}">` +
        "<h4>反思階段</h4>" +
        taskEnd

    const taskStage_Minding_complete =
        `<div class="taskStage_Box_Complete" id="Minding_${week}">` +
        "<h4>反思階段</h4>" +
        taskCompleteIcon +
        taskEnd

    //Stage 5老師回饋
    const taskStage_Response_uncomplete =
        `<div class="taskStage_Box" id="Response_${week}">` +
        "<h4>老師回饋</h4>" +
        taskEnd

    const taskStage_Response_teacherComplete =
        `<div class="taskStage_Box_teacherComplete" id="Response_${week}">` +
        "<h4>老師回饋</h4>" +
        taskEnd

    const taskStage_Response_studentComplete =
        `<div class="taskStage_Box_Complete" id="Response_${week}">` +
        "<h4>老師回饋</h4>" +
        taskCompleteIcon +
        taskEnd

    Model += taskOutlineStart + taskWeekTitle + taskMiddle + taskStageStart

    for (let i = 0; i < stage.length; i++) {
        if (stage[i]) {
            switch (i) {
                case 0:
                    Model += taskStage_Data_complete + taskArrow
                    break
                case 1:
                    Model += taskStage_Mission_complete + taskArrow
                    break
                case 2:
                    Model += taskStage_Manage_complete + taskArrow
                    break
                case 3:
                    Model += taskStage_Minding_complete + taskArrow
                    break
            }
        } else if (!stage[i]) {
            switch (i) {
                case 0:
                    Model += taskStage_Data_uncomplete
                    break
                case 1:
                    Model += taskStage_Mission_uncomplete
                    break
                case 2:
                    Model += taskStage_Manage_uncomplete
                    break
                case 3:
                    Model += taskStage_Minding_uncomplete
                    break
            }
        }
    }
    if (!stage[4]) {
        Model += taskStage_Response_uncomplete
    }
    if (stage[4] == 1) {
        Model += taskStage_Response_teacherComplete
    } else if (stage[4] == 2) {
        Model += taskStage_Response_studentComplete
    }

    Model += taskEnd + taskEnd + taskEnd
    $(".taskContainer").append(Model)

    function weekClick(clickStage, clickWeek) {
        const userId = $("#userId").html()
        const url = `/dashboard/${userId}/${clickWeek}/${clickStage}`
        window.location.href = url
    }

    if ($("#nowWeek").html().split(" ")[1] == week) {
        $(`#taskMiddle_${week}`).slideDown(200)
    }
    $(`#Data_${week}`).click(e => {
        e.preventDefault()
        weekClick("data", week)
    })
    $(`#Mission_${week}`).click(e => {
        e.preventDefault()
        weekClick("mission", week)
    })
    $(`#Manage_${week}`).click(e => {
        e.preventDefault()
        weekClick("manage", week)
    })
    $(`#Minding_${week}`).click(e => {
        e.preventDefault()
        weekClick("minding", week)
    })
    $(`#Response_${week}`).click(e => {
        e.preventDefault()
        weekClick("response", week)
    })
}

//登出功能
const logoutFunc = e => {
    axios({
        method: "GET",
        url: "/logout",
        withCredentials: true,
    }).then(res => {
        window.location.href = res.data
    })
}

//變更密碼功能
const changePasswordFunc = e => {
    const oldPassword = window.prompt("請輸入舊密碼", "")
    if (oldPassword == null || oldPassword == "") {
        return
    }
    const newPassword = window.prompt("請輸入新密碼", "")
    if(newPassword == null || oldPassword == ''){
        window.alert('取消')
        return
    }
    const newPasswordCheck = window.prompt("請再次輸入新密碼","")
    if( newPasswordCheck != newPassword){
        window.alert("兩次新密碼輸入不相同，請重新鍵入")
        return
    }
    if(newPasswordCheck == null | newPasswordCheck == ''){
        window.alert('取消')
        return
    }

    axios({
        method:'post',
        url:'/student/changepassword',
        data:{
            oldPassword:oldPassword,
            newPassword:newPassword,
        }
    }).then(response=>{
        window.alert(response.data)
    })
}

//從後端取得該人進度條
async function getStudentWeekStage() {
    let result

    await axios({
        method: "POST",
        url: "/studentstage/checkstage",
        withCredentials: true,
    }).then(res => {
        result = res.data
    })
    return result
}

//設定周進度條Click事件
function clickWeek() {
    $(`.taskWeekTitle`).click(e => {
        const targetId = e.currentTarget.id.split("_")[1]
        e.preventDefault()
        const nowWeek = $("#nowWeek").html().split(" ")
        if (targetId > nowWeek[1]) {
            window.alert("進度尚未到該周喔!")
            return
        }
        if ($(`#taskMiddle_${targetId}`).css("display") === "block") {
            $(`#taskMiddle_${targetId}`).slideUp(200)
        } else {
            $(`#taskMiddle_${targetId}`).slideDown(200)
        }
    })
}
//設定ProgressBar
function renderProgressBar(week, stage) {
    const target = document.querySelector(`#taskProgress_${week}`)
    const targetText = $(`#taskProgressText_${week}`)

    targetText.html("unCheck").css({
        color: "lightgray",
    })
    let stageProgress = 0
    stage.map((val, index) => {
        if (val === true || val == 2) {
            stageProgress += 0.2
            switch (index) {
                case 0:
                    targetText.html("Task").css({
                        color: "rgba(84, 10, 163, 0.8)",
                    })
                    break
                case 1:
                    targetText.html("Plane").css({
                        color: "rgba(84, 10, 163, 0.8)",
                    })
                    break
                case 2:
                    targetText.html("Reflection").css({
                        color: "rgba(84, 10, 163, 0.8)",
                    })
                    break
                case 3:
                    targetText.html("Feedback").css({
                        color: "rgba(84, 10, 163, 0.8)",
                    })
                    break
                case 4:
                    targetText.html("Well done").css({
                        color: "green",
                    })
                    break
            }
        }
    })
    const bar = new ProgressBar.Line(target, {
        strokeWidth: 1,
        easing: "easeInOut",
        duration: 1000,
        color: stageProgress == 1 ? "yellow" : "#540aa3cc",
        trailColor: "#f0f8ffcc",
        trailWidth: 0.5,
        svgStyle: { width: "80%", height: "100%" },
    })

    bar.animate(stageProgress)
}

//return 等待畫面loadingPage
function loadingPage(isOpen) {
    let loadingDiv = $(".loading")
    if (isOpen) {
        loadingDiv.fadeIn(400)
    } else {
        loadingDiv.fadeOut(400)
    }
}

$(window).ready(() => {
    getStudentWeekStage()
        .then(stageStatus => {
            stageStatus.map(val => {
                let taskStage = [
                    val.Status.Data,
                    val.Status.Mission,
                    val.Status.Manage,
                    val.Status.Minding,
                    val.Status.Response,
                ]
                renderWeekTaskManager(val.Week, taskStage)
                renderProgressBar(val.Week, taskStage)
            })
            return stageStatus
        })
        .then(response => {
            clickWeek(response)
            loadingPage(false)
        })
})

$("#logoutBtn").click(e => logoutFunc(e))
$("#changePassword").click(e => {
    changePasswordFunc(e)
})
