declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseInt_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseInterfacesVO_ = {
    code?: number
    data?: InterfacesVO
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseObject_ = {
    code?: number
    data?: Record<string, any>
    message?: string
  }

  type BaseResponsePageInterfacesVO_ = {
    code?: number
    data?: PageInterfacesVO_
    message?: string
  }

  type BaseResponsePagePointTransaction_ = {
    code?: number
    data?: PagePointTransaction_
    message?: string
  }

  type BaseResponsePagePointTransactionVO_ = {
    code?: number
    data?: PagePointTransactionVO_
    message?: string
  }

  type BaseResponsePageUser_ = {
    code?: number
    data?: PageUser_
    message?: string
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type BaseResponsePointsStatistic_ = {
    code?: number
    data?: PointsStatistic
    message?: string
  }

  type BaseResponsePointTransactionVO_ = {
    code?: number
    data?: PointTransactionVO
    message?: string
  }

  type BaseResponseSignInfoVO_ = {
    code?: number
    data?: SignInfoVO
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type DeleteRequest = {
    id?: number
  }

  type getInterfacesVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getMonthSignInfoUsingGETParams = {
    /** month */
    month?: number
    /** userId */
    userId: number
    /** year */
    year?: number
  }

  type getPointTransactionVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserPointsUsingGETParams = {
    /** userId */
    userId: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type IdRequest = {
    id?: number
  }

  type InterfaceExamples = {
    createTime?: string
    id?: number
    interfaceId?: number
    isDeleted?: number
    requestExample?: string
    responseExample?: string
    updateTime?: string
  }

  type InterfaceExamplesVO = {
    requestExample?: string
    responseExample?: string
  }

  type InterfacesAddRequest = {
    description?: string
    interfaceExamplesVO?: InterfaceExamplesVO
    method?: string
    name?: string
    points?: number
    requestParameters?: RequestParametersVO[]
    responseParameters?: ResponseParametersVO[]
    status?: number
    url?: string
  }

  type InterfacesEditRequest = {
    description?: string
    id?: number
    interfaceExamples?: InterfaceExamples
    method?: string
    name?: string
    points?: number
    requestParameters?: RequestParameters
    responseParameters?: ResponseParameters
    status?: number
    url?: string
  }

  type InterfacesInvokeRequest = {
    id?: number
    requestParameters?: Record<string, any>
  }

  type InterfacesUpdateRequest = {
    description?: string
    id?: number
    interfaceExamples?: InterfaceExamples
    method?: string
    name?: string
    points?: number
    requestParameters?: RequestParameters
    responseParameters?: ResponseParameters
    status?: number
    url?: string
    userId?: number
    userName?: string
  }

  type InterfacesVO = {
    description?: string
    id?: number
    interfaceExamples?: InterfaceExamplesVO
    method?: string
    name?: string
    platformUrl?: string
    points?: number
    requestParameters?: RequestParametersVO[]
    responseParameters?: ResponseParametersVO[]
    status?: number
    totalNum?: number
    userId?: number
    userName?: string
  }

  type listInterfacesByPageUsingGETParams = {
    current?: number
    description?: string
    id?: number
    method?: string
    name?: string
    pageSize?: number
    platformUrl?: string
    points?: number
    sortField?: string
    sortOrder?: string
    status?: number
    userId?: number
    userName?: string
  }

  type listInterfacesVOByPageUsingGETParams = {
    current?: number
    description?: string
    id?: number
    method?: string
    name?: string
    pageSize?: number
    platformUrl?: string
    points?: number
    sortField?: string
    sortOrder?: string
    status?: number
    userId?: number
    userName?: string
  }

  type listMyInterfacesVOByPageUsingGETParams = {
    current?: number
    description?: string
    id?: number
    method?: string
    name?: string
    pageSize?: number
    platformUrl?: string
    points?: number
    sortField?: string
    sortOrder?: string
    status?: number
    userId?: number
    userName?: string
  }

  type LoginUserVO = {
    createTime?: string
    id?: number
    points?: number
    updateTime?: string
    userAvatar?: string
    userName?: string
    userRole?: string
  }

  type OrderItem = {
    asc?: boolean
    column?: string
  }

  type PageInterfacesVO_ = {
    countId?: string
    current?: number
    maxLimit?: number
    optimizeCountSql?: boolean
    orders?: OrderItem[]
    pages?: number
    records?: InterfacesVO[]
    searchCount?: boolean
    size?: number
    total?: number
  }

  type PagePointTransaction_ = {
    countId?: string
    current?: number
    maxLimit?: number
    optimizeCountSql?: boolean
    orders?: OrderItem[]
    pages?: number
    records?: PointTransaction[]
    searchCount?: boolean
    size?: number
    total?: number
  }

  type PagePointTransactionVO_ = {
    countId?: string
    current?: number
    maxLimit?: number
    optimizeCountSql?: boolean
    orders?: OrderItem[]
    pages?: number
    records?: PointTransactionVO[]
    searchCount?: boolean
    size?: number
    total?: number
  }

  type PageUser_ = {
    countId?: string
    current?: number
    maxLimit?: number
    optimizeCountSql?: boolean
    orders?: OrderItem[]
    pages?: number
    records?: User[]
    searchCount?: boolean
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    countId?: string
    current?: number
    maxLimit?: number
    optimizeCountSql?: boolean
    orders?: OrderItem[]
    pages?: number
    records?: UserVO[]
    searchCount?: boolean
    size?: number
    total?: number
  }

  type PointsStatistic = {
    dailyConsumption?: number
    monthlyConsumption?: number
  }

  type PointTransaction = {
    createTime?: string
    description?: string
    id?: number
    interfaceId?: number
    interfaceName?: string
    isDeleted?: number
    pointsChange?: number
    transactionType?: string
    updateTime?: string
    userId?: number
  }

  type PointTransactionQueryRequest = {
    current?: number
    description?: string
    endTime?: string
    interfaceId?: number
    pageSize?: number
    pointsChange?: number
    sortField?: string
    sortOrder?: string
    startTime?: string
    transactionType?: string
    userId?: number
  }

  type PointTransactionVO = {
    createTime?: string
    description?: string
    interfaceId?: number
    interfaceName?: string
    pointsChange?: number
    transactionType?: string
    userId?: number
    userName?: string
  }

  type RequestParameters = {
    createTime?: string
    dataType?: string
    description?: string
    id?: number
    interfaceId?: number
    isDeleted?: number
    isRequired?: number
    name?: string
    paramType?: string
    updateTime?: string
  }

  type RequestParametersVO = {
    dataType?: string
    description?: string
    isRequired?: number
    name?: string
    paramType?: string
  }

  type ResponseParameters = {
    createTime?: string
    dataType?: string
    description?: string
    id?: number
    interfaceId?: number
    isDeleted?: number
    name?: string
    updateTime?: string
  }

  type ResponseParametersVO = {
    dataType?: string
    description?: string
    name?: string
  }

  type SignInfoVO = {
    continuousDays?: number
    points?: number
    signInfo?: boolean[]
  }

  type signUsingPOSTParams = {
    /** userId */
    userId: number
  }

  type User = {
    accessKey?: string
    createTime?: string
    id?: number
    isDeleted?: number
    points?: number
    secretKey?: string
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userRole?: string
  }

  type UserAddRequest = {
    userAvatar?: string
    userName?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userName?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userName?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    checkPassword?: string
    userName?: string
    userPassword?: string
  }

  type UserUpdateMyRequest = {
    userAvatar?: string
    userName?: string
  }

  type UserUpdateRequest = {
    id?: number
    userAvatar?: string
    userName?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    id?: number
    points?: number
    userAvatar?: string
    userName?: string
    userRole?: string
  }
}
