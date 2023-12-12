# Used Car Pricing API

## 준비
- .env.development
- .env.test

## Task
- [ ] 유저는 이메일로 회원가입할 수 있다
- [ ] 유저는 중고차를 판매할 때 대략적인 견적을 받을 수 있다 (메이커, 모델, 연식, 주행거리에 따른)
- [ ] 유저는 차량을 판매한 가격을 보고할 수 있다
- [ ] 관리자는 보고된 판매를 승인해야 한다

## API

<table>
  <tbody>
    <tr>
      <th>모듈</th>
      <th>메서드 & 라우트</th>
      <th>바디 or 쿼리스트링</th>
      <th>설명</th>
    </tr>
    <tr>
      <td>Users</td>
      <td>POST /auth/signup</td>
      <td>
<pre>{
  email: string
  password: string
}</pre>
      </td>
      <td>새 유저를 만들고 회원가입</td>
    </tr>
    <tr>
      <td>Users</td>
      <td>POST /auth/signin</td>
      <td>
<pre>{
  email: string
  password: string
}</pre>
      </td>
      <td>기존 가입 유저로 로그인</td>
    </tr>
    <tr>
      <td>Reports</td>
      <td>GET /reports</td>
      <td>
        쿼리스트링(`maker`, `model`, `year`, `mileage`, `longitude`, `latitude`)
      </td>
      <td>차 가격에 대한 견적 받기</td>
    </tr>
    <tr>
      <td>Reports</td>
      <td>POST /reports</td>
      <td>
<pre>{
  maker: string
  model: string
  year: string
  mileage: string
  longitude: string
  latitude: string
  price: number
}</pre>
      </td>
      <td>얼마에 팔지 리포트 제출</td>
    </tr>
    <tr>
      <td>Reports</td>
      <td>PATCH /reports</td>
      <td>
<pre>{
  approved: boolean
}</pre>
      </td>
      <td>유저에 의해 제출된 리포트를 승인하거나 거절</td>
    </tr>
  </tbody>
</table>