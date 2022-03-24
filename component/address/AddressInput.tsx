import { useState, useRef } from "react"
import DaumPost from "./DaumPost";

export default function AddressInput(props: any) {
  const [zonecode, setZonecode] = useState(''); // 우편번호
  const [address, setAddress] = useState(''); // 주소
  const [addressDetail, setAddressDetail] = useState(''); // 상세주소
  const [wrongaddressDetail, setwrongAddressDetail] = useState(''); // 상세주소
  const [isOpenPost, setIsOpenPost] = useState(false);
  const [validationaddress, setvalidationaddress] = useState(false)

  const opendaumPost = (event: any) => {
    event.preventDefault()
    setIsOpenPost(!isOpenPost)
  }

  const addressDetailInputHandler = (event: any) => {
    setAddressDetail(event.currentTarget.value)
    console.log(event.currentTarget.value)
    if (addressDetail === "") {
      setwrongAddressDetail("상세주소를 입력해주세요.")
      setvalidationaddress(false)
    } else {
      setwrongAddressDetail("")
    }

  }

  const getAddress = (value: any) => {
    props.setAddressFunction(value)
    setAddress(value)

  }

  const getZonecode = (value: any) => {
    props.setZonecodeFunction(value)
    setZonecode(value)

  }


  return (
    <div className="address">
      주소
      <input type="text" id="zonecode" defaultValue={zonecode} placeholder="우편번호" />
      <button type="button" onClick={opendaumPost} defaultValue="우편번호 찾기">🔍︎주소검색</button><br />
      <input type="text" id="address" defaultValue={address} placeholder="주소" /><br />
      <input type="text" id="addressDetail" defaultValue={addressDetail} onChange={addressDetailInputHandler} placeholder="상세주소" />
      <div className="validation">{wrongaddressDetail}</div>

      {isOpenPost ?
        <div>
          <DaumPost
            setAddressFunction={getAddress}
            setZonecodeFunction={getZonecode}
          />
        </div> : ""}

    </div>
  )

}

