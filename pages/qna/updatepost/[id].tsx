import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import useCustomSWR from "../../../utils/client/useCustumSWR"
import customAxios from "../../../utils/customAxios"


type post = {
    title: string,
    ordernumber: string,
    content: string
    qacategory: string,
    date: number,
    qaid: number,
    _id: number,
    answer: boolean,
    userid: number
}
export default function UpdatePost() {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<post>({
        mode: "onSubmit"
    })
    const router = useRouter()
    let post: any = {}
    const { id } = router.query

    const { data, isLoading, isError } = useCustomSWR("/api/qaboard")
    if (isError) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>
    for (let d of data) {
        if (d.qaid == id) {
            post = d
        }
    }


    const onSubmit: SubmitHandler<post> = async (data: post) => {
        if (id === undefined) {
            return
        }
        data.qaid = parseInt(id.toString())

        alert(JSON.stringify(data, null, 2))
        try {
            const res = await customAxios.put("/api/qaboard", data)
            if (res.status == 200) {
                router.push('/qna')
                alert('문의가 수정 되었습니다.')
            } else {
                alert('수정이 실패했습니다.')
            }

        } catch (err) {
            console.log(err)
            alert('접수에 실패했습니다.')
        }

    }
    // console.log(watch())




    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <div className="container">
                <div className="content">
                    <table>
                        <tbody>
                            <tr>
                                <th>문의유형</th>
                                <td>
                                    <div className="select">
                                        <select defaultValue={post.qacategory}  {...register("qacategory", { required: true })}>
                                            <option value="">문의유형 선택</option>
                                            <option value="교환">교환</option>
                                            <option value="환불">환불</option>
                                            <option value="배송">배송</option>
                                            <option value="상품문의">상품문의</option>
                                            <option value="주문취소">주문취소</option>
                                            <option value="주문/결제">주문/결제</option>
                                            <option value="이벤트">이벤트</option>
                                        </select>
                                        {errors.qacategory && alert("문의 유형을 선택해주세요")}
                                    </div>
                                </td>
                            </tr>
                            {/* <tr>
                                <th>주문번호</th>
                                <td>
                                    <input {...register("ordernumber", { required: true })} placeholder="주문번호를 조회해주세요." type="text" />
                                    {errors.ordernumber && alert("주문번호를 조회해주세요")}
                                    <button>주문조회</button>
                                </td>
                            </tr> */}
                            <tr>
                                <th>제목</th>
                                <td>
                                    <input defaultValue={post.title} {...register("title", { required: true })} placeholder="제목을 입력해주세요." />
                                    {errors.title && alert("제목을 입력해주세요")}
                                </td>
                            </tr>
                            <tr>
                                <th>문의내용</th>
                                <td>
                                    <textarea defaultValue={post.content} {...register("content", { required: true })} cols={50} rows={10} placeholder="내용을 입력해주세요." />
                                    {errors.content && alert("내용을 입력해주세요.")}

                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <Link href="/qna" passHref>
                            <button >뒤로가기</button>
                        </Link>
                        <button type="submit">수정하기</button>
                    </div>
                </div>
            </div>
        </form >
    )
}