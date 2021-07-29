<template lang="html">
  <div class="terms-main">
    <div>
      <div class="terms-header">
        {{ $t('verifyComponent.terms_of_service') }}
      </div>
      <div class="terms-inner">
        <iframe
          src="https://sendy-web-apps-assets.s3-eu-west-1.amazonaws.com/t%26cs/FreightTermsandConditions_shipper.html"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsAndCondition',
};
</script>

<style lang="css">
.terms-main {
  text-align: center;
  border: 0px solid #ccc;
  margin: 7%;
}

.terms-inner {
  border: 1px solid #A29D9D;
  border-radius: 4px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  height: 30rem;
}

.terms-header {
  font-weight: 500;
  text-align: left;
  font-family: 'Nunito', sans-serif;
  font-size: 18px;
  line-height: 0px;
  display: flex;
  align-items: center;
  color: #000000;
}
.freight-terms{
  text-align: left;
  font-size: 14px;
  line-height: 5px;
  color: #000000;
}
.next-terms-holder-btn {
  margin-top: 2%;
  padding-bottom: 4% !important;
}
.terms-btn-color {
 border-width: 0px !important;
}
.next-freight-submit {
  width: 15%;
}
.approval-card{
  max-width: 24rem;
  border: 1px solid #d8dfe6;
  border-radius: 4px;
  margin: 1rem auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
}
.warning-icon{
  font-size: 57px !important;
  color: #1B7FC3 !important;
}
.warning-icon-pstn{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 14%;
}
.cancelOptions--content-message {
  margin: 15px;
  margin-bottom: 30px;
}
.verification-header{
  font-size: 16px;
  text-align: center;
  color: #000000;
}
.verification-description{
  font-size: 14px;
  text-align: center;
  color: #343232;
}
</style>
