const LoginFunc = (e) => {
  
    const Account = $('#Account').val()
    const Password = $('#Password').val()

    if(Account === ""){
        window.alert("請輸入帳號")
        loadingPage(false)
        return
    }
    if(Password === ""){
        window.alert("請輸入密碼")
        loadingPage(false)
        return
    }

    axios({
        method: "POST",
        data: {
            username: Account,
            password: Password,
        },
        url: '/login',
        withCredentials: true,
    }).then(res=>{
        if(res.data == '無此用戶'){
            window.alert('無此用戶')
            loadingPage(false)
            return
        }
        if(res.data == '密碼錯誤'){
            window.alert("密碼錯誤")
            loadingPage(false)
            return
        }
        loadingPage(false)
        window.location.href = res.data
    })
}

//return 等待畫面loadingPage
function loadingPage(isOpen) {
    let loadingDiv = $('.loading')
    if (isOpen) {
        loadingDiv.fadeIn(400)
    } else {
        loadingDiv.fadeOut(400)
    }
}


$(document).ready(e =>{
    loadingPage(false)

    $('#loginNormal').click(e => {
        loadingPage(true)
        LoginFunc(e)
        
    })
    
    $(document).keydown((e)=>{
        if(e.keyCode == 13){
            loadingPage(true)
        LoginFunc(e)
        }
    })
    
})