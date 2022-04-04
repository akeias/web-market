import useCustomSWR from "../../utils/client/useCustumSWR"
import userinfoStyle from "../../styles/mypage/userinfo.module.css"
import { NextPage } from "next"


const UserInfo: NextPage = () => {
    const { data, isLoading, isError } = useCustomSWR("/api/user/info")
    if (isError) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>
    console.log(data)
    return (
        <div className={userinfoStyle.content}>
            <h2>회원정보</h2>
            <table>
                <tbody>
                    <tr>
                        <th className={userinfoStyle.row}>아이디</th>
                        <td>{data.id}</td>
                    </tr>
                    <tr>
                        <th className={userinfoStyle.row}>이름</th>
                        <td>{data.name}</td>
                    </tr>
                    <tr>
                        <th className={userinfoStyle.row}>이메일</th>
                        <td>{data.email}</td>
                    </tr>
                    <tr>
                        <th className={userinfoStyle.row}>휴대전화</th>
                        <td>{data.phonenumber}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default UserInfo