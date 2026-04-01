export default awsmobile;
declare namespace awsmobile {
    let aws_project_region: string;
    let aws_appsync_graphqlEndpoint: string;
    let aws_appsync_region: string;
    let aws_appsync_authenticationType: string;
    let aws_appsync_apiKey: string;
    let aws_cognito_identity_pool_id: string;
    let aws_cognito_region: string;
    let aws_user_pools_id: string;
    let aws_user_pools_web_client_id: string;
    let oauth: {};
    let aws_cognito_username_attributes: never[];
    let aws_cognito_social_providers: never[];
    let aws_cognito_signup_attributes: string[];
    let aws_cognito_mfa_configuration: string;
    let aws_cognito_mfa_types: string[];
    namespace aws_cognito_password_protection_settings {
        let passwordPolicyMinLength: number;
        let passwordPolicyCharacters: never[];
    }
    let aws_cognito_verification_mechanisms: string[];
    let aws_user_files_s3_bucket: string;
    let aws_user_files_s3_bucket_region: string;
}
