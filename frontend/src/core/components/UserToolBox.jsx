import { Flex, Popover, Button } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons"
import { showToast } from "core/utils/toast";
import { useNavigate } from 'react-router-dom'
import { logoutApi, getUserInfoApi } from "core/api/user";
import { HiUserCircle } from "react-icons/hi";
import { useEffect, useState, useReducer } from "react";
import userReducer, { initialState } from "../store/reducers/userReducer";
import { useUserContext } from "../contexts/UserContext";


const UserToolBox = () => {
    const {user, dispatchUser} = useUserContext()
    const navigate = useNavigate()

    const content = (
        <>
            <Flex vertical className={"flex items-center w-36 rounded-lg z-50"} >
                <Flex vertical className="justify-center items-center w-full h-9 hover:bg-[#292E3B]" onClick={() => navigate('/user')}>
                    <Flex className="w-2/3 justify-around p-2">
                        <UserOutlined className="text-md" />
                        <p className="text-md select-none">
                            个人中心
                        </p>
                    </Flex>
                </Flex>
                <Flex vertical className="justify-center items-center w-full h-9 mt-2 hover:bg-[#292E3B]" onClick={logout}>
                    <Flex className="w-2/3 justify-around p-2" onClick={() => console.log("he;")}>
                        <LogoutOutlined className="text-md" />
                        <p className="text-md select-none">
                            退出登录
                        </p>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )

    //退出登录
    async function logout() {
        // @ts-ignore
        dispatchUser({
            type: "removeUser"
        })
        try {
            const params = {
                accessToken: localStorage.getItem("token"),
                refreshToken: localStorage.getItem("refreshToken")
            }
            await logoutApi(params)
            localStorage.removeItem("token")
            localStorage.removeItem("refreshToken")
            // @ts-ignore
            dispatchUser({
                type: "removeUser"
            })
            navigate('/login')
            showToast({
                title: '退出登录成功',
                color: 'success'
            })
        } catch (error) {
            console.error(error)
        }
    }

    function getUserInfo() {
        getUserInfoApi()
            .then((res) => {
                // @ts-ignore
                dispatchUser({
                    type: "addUser",
                    payload: res
                })
            }).catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        getUserInfo()
    }, [])

    return (
        <>
            {user.user?.username !== 'anonymous'  ? (<Popover content={content}>
                <div
                    className="relative flex items-center select-none w-auto pl-2 pr-2 rounded-md hover:bg-[#30333C] cursor-pointer"
                >
                    <div>
                        <HiUserCircle className="w-8 h-8" />
                    </div>
                    <div className="h-1/2 flex flex-col justify-center">
                        <p className="text-base relative -top-0.5">{user.user?.username}</p>
                    </div>
                </div>
            </Popover>) : <Button type="link" onClick={() => navigate("/login")}>登录</Button>}
        </>
    )
}

export default UserToolBox
