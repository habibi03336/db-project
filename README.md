# 데이터베이스 프로젝트 \[2022-2\]

## 시연영상

[![DB프로젝트 시연영상](https://i9.ytimg.com/vi_webp/qML20ns51SY/mq2.webp?sqp=CMSLlJ0G-oaymwEmCMACELQB8quKqQMa8AEB-AHOCYAC0AWKAgwIABABGFkgWShZMA8=&rs=AOn4CLArBdM_ko2I_bGP_lPQbKOR0wku6Q)](https://www.youtube.com/watch?v=qML20ns51SY)

## 어플리케이션 데이터

어플리케이션 데이터를 sqlite DB를 활용하여 관리한다.
host, port, database를 키로 하여 sqlite DB를 생성하고 내부적으로 RDB로 테이블과 어트리뷰트 관련 데이터를 관리한다.

<p align="center">
  <img src="./schema.PNG?raw=true" width="100%" title="RDB 스키마">
</p>

## 기능목록

### A-1. SourceDB 관리

- [x] DB연결을 하고, 기본 파일 구조를 생성한다. (make connection)

- [x] CSV 파일을 테이블로 업로드 한다. (csvToTable)

### A-2. 테이블 속성 도메인 스캔

- [x] DB에 저장된 테이블 목록을 표시한다. (readTables)

- [x] 특정 테이블의 속성을 스캔하여 결과값을 파일로 저장 및 반환한다. (scanTableFeature)

  - 공통

    - [x] 속성의 data type을 보여준다. (sql 기능 이용)
    - [x] NULL 레코드 수, NULL 레코드 비율을 보여준다. (lib/nullCount)
    - [x] 중복되는 레코드 비율이 10% 미만인 속성을 결합 키 후보로 설정한다. (uniqueValueCount, uniqueCatogoryCount 활용하여 구현)

  - 수치 속성의 경우

    - [x] 상이 수치값을 보여준다. (lib/uniqueValueCount)
    - [x] 최소, 최대 값을 보여준다. (lib/minMax)
    - [x] 0레코드 수, 0 레코드 비율을 보여준다. (lib/zeroValueCount)

  - 범주 속성의 경우

    - [x] 상이 범주값을 보여준다. (lib/uniqueCategoryCount)
    - [x] “특수문자 포함 레코드 수”, “특수문자 포함 레코드 비율”을 보여준다. (lib/specialCharCount)

- [x] 결합 키 후보 속성과 표준 결합키 사전의 값을 매핑하고, 파일 데이터를 업데이트한다. (mappingFK)

<!-- - [ ] 대표 속성과 표준 대표속성을 매핑한다. (mappingPK) -->

### A-3. 테이블 속성 편집

- [x] 스캔된 테이블 중 하나를 선택한다. (readScanTable)

- [x] 선택된 테이블의 스캔 결과를 받는다. (readScanResult)

- [x] 테이블의 속성을 삭제한다. (deleteFeature)

- [x] 테이블 속성의 타입을 변경한다. (modifyFeatureDataType)

- [x] 결합키 후보속성과 표준결합키 사전의 값을 매핑한다. (mappingFK) - 테이블 속성 도메인 스캔 기능 재활용

### B-1. 단일 결합

- [x] 테이블 검색 기능

- [x] 테이블 선택시 가능한 결합키를 반환하는 기능

- [x] 결합키 선택시 해당 결합키를 가진 테이블을 반환하는 기능

- [x] 선택된 테이블에 대하여 표준결합키를 사용하여 해당 표준결합키와 매핑된 대표 결합키를 보유한 테이블의 목록을 반환한다. (findTableJoinCandidate)

- 두 테이블을 결합하고 결과를 보여준다. (tableJoin)

  - [x] 결과 레코드 수, 결합 성공률\_w1, 결합 성공률 5 \_w2, 결합 테이블명을 보여준다.

<!-- ### B-2. 다중 결합

- [ ] 선택된 테이블에 대하여 결합을 진행할 수 있는 테이블을 보여준다 - 단일 결합 기능 재활용(findTableJoinCandidate)

- [ ] 여러 테이블에 대한 join을 수행하고 결과를 file로 저장한다. (tableJoinMany)

### B-3. 결과 조회

- [ ] 저장된 테이블 스캔 결과, 단일 테이블 결합 수행결과, 다중 테이블 결합 수행결과를 보여 준다. (showResult)

- [ ] 저장된 결과를 다운로드 받을 수 있게 해준다. (downloadResult) -->

---

## 개발환경

1. node.js를 설치해 주세요
2. 터미널로 접속하여 프로젝트 디렉토리 `npm install`을 입력해주세요.
3. 도커를 설치해주세요.
4. 도커 설치후 mariadb 도커 이미지를 다운받아주세요.
5. 위 작업이 모두 끝났으면 `sh develop.sh`를 입력하면 더미 데이터가 들어있는 maria DB와 프로그램이 동시에 실행됩니다. (ctrl+c로 프로그램을 닫으면 프로그램과, DB가 같이 종료됩니다.)

- window환경이라서 sh 명령어가 작동하지 않는다면
  > https://m.blog.naver.com/wideeyed/222031178871 이 글을 참고하거나
  > develop.sh 파일에서 마지막 줄 빼고 첫 두 줄을 차례로 입력해주세요

## 개발 안내사항

### 프론트엔드

프론트엔드는 src/renderer/ 안에 있는 소스코드에 해당합니다. 일반 웹페이지를 만드는 React의 소스코드와 동일합니다.

프론트엔드에서 백엔드의 기능을 호출하고 싶으면 다음과 같이 사용하면됩니다.

```javascript
const 기능이름 = 'makeConnection';
const 넘겨주는변수 = []; // 배열로 넘겨야함
const res = await db.command.request(기능이름, 넘겨주는변수); //res에 백엔드의 응답이 담겨있음
```

백엔드 응답의 형식 예시는 다음과 같습니다.

```javascript
const successResult = {
  status: true,
  data: {}, // 없을 수도 있음
  message: '작업 성공', // 없을 수도 있음
};

const errorResult = {
  status: false,
  message: '~에서 에러가 발생했습니다.',
};
```

### 백엔드

백엔드는 src/main/ 안에 있는 소스코드에 해당합니다.

프론트엔드에서 호출되는 기능들 입니다. 프론트엔드에서 보내는 인자는 arg에 배열로 담겨있습니다.
(프론트엔드에서 직접 호출이 되지 않는 기능은 lib으로 분리했습니다.)

db에 sql를 요청하고 싶으면 다음과 같이 사용하면 됩니다.

```javascript
const 내SQL = 'SELECT * FROM my_table;';
const res = await dbClient.sql(내SQL); // res를 그대로 return하는 것은 막혀있음. 필요한 데이터 가공 후 return 해야함
```

프로그램에서 db가 연결되어 있어야 잘 작동합니다. 연결되있지 않으면 오류가 발생합니다.

---

결과를 반환할 때는 성공, 오류 두 가지로 나누어서 반환합니다.

```javascript
//성공시 (넘겨줄 data가 첫 번째 인자 성공 메세지가 두 번째 인자, 둘 다 필수는 아님)
const exampleData = {nullCount: 12, nullRatio: 0.2 ... };
return success(exampleData, "성공 메세지");

//실패시
return error("에러 메세시");
```

---

잘 동작하는지 확인하고 싶으면 electron 프로그램에서 개발자 콘솔을 킨 이후에 다음과 같이 요청을 보내볼 수 있습니다.

```javascript
await db.command.request('기능 채널이름', [argument1, argument2 ...]);
```

## 개발요구사항

1. git을 활용하여 소스코드를 관리합니다.
2. `git add [파일이름]`로 변경한 파일만 staging 합니다.
3. `git commit -m 'commit message'`로 커밋을 합니다.
   - 프론트엔드 기능 개발 커밋 예시: "\[FE\] feat: db커넥션 화면 개발"
   - 백엔드 에러 수정 커밋 예시: "\[BE\] fix: db table 불러오기 수정"
4. git push로 원격 저장소의 코드를 변경합니다.

### 소스코드 conflict 방지대책

- 개발할 기능을 나누어 같은 파일을 건드는 경우를 최소화 합니다.
- 커밋과 푸시를 기능 단위로 잘게 쪼개서 진행합니다.
- `git pull`을 수시로 하여 코드를 자주 최신화합니다.
- 다른 사람이 건드릴 수 있는 파일을 수정하는 경우 `git pull`을 먼저하고 톡 방에 알려서 다른 사람이 동시에 수정하지 않도록 합니다.

## 추가 팁

- [MariaDB sql문이 유효한지 확인해주는 사이트](https://extendsclass.com/mysql-online.html)
