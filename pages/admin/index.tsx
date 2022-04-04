import type { NextPage } from 'next'
import Head from 'next/head'
import HeaderCompo from '../../component/index/HeaderCompo'
import FooterCompo from '../../component/index/FooterCompo'
import { useRouter } from 'next/router'
import useCustomSWR from '../../utils/client/useCustumSWR'


const Admin: NextPage = (props) => {
    const router = useRouter()
    const { data, isLoading, isApiError, isServerError } = useCustomSWR("/api/user/auth")
    if (isLoading) return <div>로딩중...</div>
    if (isServerError) {
        alert("서버 에러가 발생하였습니다")
        router.push("/")
    }
    if (isApiError) {
        alert("로그인이 필요합니다")
        router.push("/login")
    }
    if (data != "admin") {
        alert("권한이 없습니다")
        router.push("/")
    }
    return (
        <div>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <HeaderCompo></HeaderCompo>
            <div className='d-flex flex-column flex-shrink-0 p-3 text-white bg-dark' style={{ width: "280px" }}>
                <ul className='nav nav-pills flex-column mb-auto'>
                    <li className='nav-item'>
                        <a className='nav-link active'>유저목록</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link text-white'>상품목록</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link text-white'>유저목록</a>
                    </li>
                </ul>
            </div>
            <FooterCompo></FooterCompo>
        </div>
    )
}

export default Admin
