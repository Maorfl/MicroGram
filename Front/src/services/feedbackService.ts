import { Slide, toast } from "react-toastify";

function successMsg(message: string) {
    toast.success(message, {
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
    });
}

function errorMsg(message: string) {
    toast.error(message, {
        position: "bottom-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
    });
}

async function promiseToast(callback:any,message:string,options?:any) {
    let response;
    if (options) {
         response = await toast.promise(
             callback(options),
            {
                pending:'Please wait...',
                success:message,
                error:"Something went wrong"
            },
            {position: "bottom-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
        }
        )
    } else {
        response = await toast.promise(
             callback(),
            {
                pending:'Please wait...',
                success:message,
                error:"Something went wrong"
            },
            {position: "bottom-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,}
        )
    }
    return response;
}
async function promiseLoginToast(callback:any,options:any) {
    let response;
         response = await toast.promise(
             callback(options),
            {
                pending:'Please wait...',
                success:"Welcome back",
                error:"Wrong email or password"
            },
            {position: "bottom-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
        }
        )

    return response;
}


export const feedbackService = {
    errorMsg,
    successMsg,
    promiseToast,
    promiseLoginToast
}