sequelize model:create --name document_collaborator --attributes id:integer,email:string,user_id:integer,document_id:integer,document_version_number:integer,revoked_access:boolean

sequelize model:create --name document --attributes id:integer,title:string,description:string,forked:boolean,original_document_id:integer,original_version_number:integer,project_id:integer,latest_version:integer

sequelize model:create --name issue --attributes id:integer,name:string,description:text,open:boolean,type:string,resolving_version_id:integer

sequelize model:create --name notification --attributes id:integer,recipient_id:integer,sender_id:integer,uri:text,message:text,status:string,read_date:date,disclosure_updated:boolean

sequelize model:create --name project_admin --attributes id:integer,user_id:integer,project_id:integer

sequelize model:create --name project_editor --attributes id:integer,user_id:integer,project_id:integer

sequelize model:create --name project --attributes id:integer,name:string,symbol:string,description:text,logo_url:text,website:text

sequelize model:create --name question --attributes id:integer,markdown:text

sequelize model:create --name role --attributes id:integer,name:string

sequelize model:create --name tag --attributes name:string

sequelize model:create --name version_answer --attributes id:integer,version_question_id:integer,markdown:text,latest:boolean

sequelize model:create --name version_question --attributes id:integer,version_id:integer,order_in_version:integer,markdown:text,latest:boolean

sequelize model:create --name version --attributes id:integer,document_id:integer,submitted:boolean,reviewed:boolean,comment_until_unix:bigint,scorecard:jsonb,version_number:text

sequelize model:create --name user --attributes id:integer,email:string,password:string,salt:string,googleId:string,uportAddress:string,first_name:string,last_name:string,name:string,username:string,organization:string,restricted_access:boolean,anonymity:boolean,onboard:boolean,reset_password_token:string,reset_password_expiration:integer

sequelize model:create --name comment_upvote --attributes user_id:integer,comment_id:integer

sequelize model:create --name document_upvote --attributes user_id:integer,document_id:integer

sequelize model:create --name document_downvote --attributes user_id:integer,document_id:integer

sequelize model:create --name comment_tag --attributes comment_id:integer,tag_id:integer
