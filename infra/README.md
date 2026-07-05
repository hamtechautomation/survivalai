# Infrastructure — one-click hosting stack

`cloudformation.yaml` provisions the whole public-hosting stack in one shot:
a **private S3 bucket** + **CloudFront** (HTTPS, Origin Access Control) + the
bucket policy that lets only CloudFront read it. Unlike GitHub Pages, this can
hold the large PDFs and map files.

## Deploy the stack

**Option A — AWS Console (no tools needed):**
1. CloudFormation → *Create stack* → *Upload a template file* → pick `cloudformation.yaml`.
2. Set **BucketName** (must be globally unique). Leave the domain fields blank for now.
3. Create the stack (takes a few minutes — CloudFront is slow to deploy).
4. Open the stack's **Outputs** tab — copy `BucketName`, `DistributionId`, and `CloudFrontURL`.

**Option B — AWS CLI:**
```bash
aws cloudformation deploy \
  --template-file infra/cloudformation.yaml \
  --stack-name last-light \
  --parameter-overrides BucketName=last-light-yourname-2026

aws cloudformation describe-stacks --stack-name last-light \
  --query 'Stacks[0].Outputs'
```

## Then upload the site
Put the Outputs into your gitignored `.env.deploy`:
```
BUCKET=last-light-yourname-2026
CF_DIST=E1234ABCDEFGH
```
…then from the project root:
```bash
sh build-packages.sh   # builds the Lite/Standard download ZIPs
sh deploy-s3.sh        # uploads the site + ZIPs, invalidates CloudFront
```
Your site is live at the `CloudFrontURL` from the Outputs.

## Custom domain (optional)
1. Request an **ACM certificate in `us-east-1`** for your domain (CloudFront only
   reads certs from that region) and validate it (DNS).
2. Re-deploy the stack with `DomainName=survivalguide.example.com` and
   `AcmCertificateArn=arn:aws:acm:us-east-1:…`.
3. Point your domain's DNS (CNAME, or an ALIAS/A-record if using Route 53) at the
   CloudFront domain shown in the Outputs.

## Notes
- The bucket is **fully private**; nothing is publicly readable except through
  CloudFront over HTTPS — which the offline/PWA features require.
- `PriceClass_100` keeps CloudFront on the cheapest edge locations. The cost that
  matters is data-out (a ~580 MB Standard download ≈ $0.05); the donation button
  offsets it.
- Prefer **Terraform**? The same three resources map 1:1 — an `aws_s3_bucket`
  (+ `aws_s3_bucket_public_access_block`), an `aws_cloudfront_origin_access_control`,
  an `aws_cloudfront_distribution`, and an `aws_s3_bucket_policy` with the same
  `AWS:SourceArn` condition. The CloudFormation file is the reference.
