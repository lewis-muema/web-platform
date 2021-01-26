<template lang="html">
  <div>
    <div v-if="tracking_data !== undefined">
      <div v-if="interCountyInforBar()">
        <inter-county-window />
      </div>
      <div v-else>
        <div>

          <transition name="fade" mode="out-in">
            <div v-if="!getTrackMoreInfo && tracking_data !== undefined">
              <div v-if="!loading" class="infobar--outer">
                <div class="infobar--content infobar--content-padded">
                  <div class="infobar--photo infobar--content infobar--item infobar--item-bordered">
                    <img class="rimg" :src="tracking_data.rider.rider_photo" />
                  </div>
                  <div class="infobar--content infobar--item infobar--driver infobar--item-bordered">
                    <div v-if="tracking_data.confirm_status > 0" class="infobar--driver-details">
                      <div class="">
                        {{ tracking_data.rider.rider_name }} - {{ tracking_data.rider.rider_phone }}
                      </div>
                      <div class="">
                        {{ tracking_data.rider.vehicle_name }} {{ tracking_data.rider.number_plate }}
                      </div>
                    </div>
                    <div v-else class="infobar--driver-details">
                      <div class="" v-if="!tracking_data.eta_data.delayed">
                        {{ tracking_data.description_head }}
                      </div>
                      <div class="marketing-message-align">
                        {{ tracking_data.marketing_message }}
                      </div>
                    </div>
                  </div>
                  <div
                    class="infobar--content infobar--item infobar--order infobar--item-bordered infobar--order-align"
                    v-if="!externalTracking"
                  >
                    <div v-if="getStatus === 'Pending'" class="">
                      <div
                        v-if="
                          [20, 25].includes(tracking_data.rider.vendor_id) &&
                            'customer_min_amount' in tracking_data.package_details &&
                            !tracking_data.fixed_cost
                        "
                      >
                        {{$t('general.minimum_amount')}} : {{ tracking_data.price_tier.currency ? tracking_data.price_tier.currency : tracking_data.currency }}
                        {{ tracking_data.package_details.customer_min_amount }}
                      </div>
                      <div v-else>
                        {{ tracking_data.price_tier.currency ? tracking_data.price_tier.currency : tracking_data.currency }} {{ tracking_data.amount }}
                      </div>
                    </div>
                    <div v-else>{{ tracking_data.price_tier.currency ? tracking_data.price_tier.currency : tracking_data.currency }} {{ tracking_data.amount }}</div>
                    <div class="">
                      <div class="">
                        {{ tracking_data.order_no }}
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="this.$route.name !== 'tracking_external'"
                    class="infobar--content infobar--item infobar--actions"
                  >
                    <div v-if="false">
                      <div class="infobar--actions-icon">
                        <i class="el-icon-sold-out" />
                      </div>
                      <div class="infobar--actions-text">
                        {{$t('general.free_delivery')}}
                      </div>
                    </div>
                    <div v-if="false">
                      <div class="infobar--actions-icon">
                        <i class="el-icon-share" />
                      </div>
                      <div class="infobar--actions-text">
                        {{$t('general.share_status')}}
                      </div>
                    </div>
                    <div class="infobar--actions-hover" @click="maximiseInfoDetails()">
                      <div class="infobar--actions-icon">
                        <i class="el-icon-circle-plus-outline" />
                      </div>
                      <div class="infobar--actions-text">
                       {{$t('general.expand_info')}}
                      </div>
                    </div>
                    <div
                      v-if="cancelBtnState()"
                      class="infobar--actions-hover"
                      @click="canceldialog()"
                    >
                      <div class="infobar--actions-icon">
                        <i class="el-icon-circle-close-outline" />
                      </div>
                      <div class="infobar--actions-text">
                       {{$t('general.cancel_order')}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div v-if="getTrackMoreInfo && tracking_data !== undefined" class="truck-info-component">
          <transition name="fade" mode="out-in">
            <div v-if="!loading" class="infobar--outer">
              <div key="prime" class="infobar-content infobar--content-padded">

                <!-- Tracking more Info top bar -->

                <HeaderSection :trackingData="tracking_data" />


                <el-row
                  :gutter="20"
                  class="infobar-content infobar--truck-cont-item infobar--truck-cont-padding"
                >
                  <LocationsSection :trackingData="tracking_data" />
                  <InstructionsSection :trackingData="tracking_data" />
                  <OrderTimelineSection :trackingData="tracking_data" />

                </el-row>

                <FooterSection v-if="getStatus !== 'Pending'" :trackingData="tracking_data" />
              </div>
            </div>
          </transition>
        </div>

        <div>
          <transition name="fade" mode="out-in">
            <div class="">

              <!-- Order Cancellation Dialog -->

              <el-dialog :visible.sync="cancelOption" class="cancelOptions">
                <div class="cancelOptions--content-wrap" v-if="extendedDialog()">
                  <div class="">
                    <div class="cancel-reason-title" id="cancel-reason-title">
                     {{$t('general.sure_to_cancel')}}
                    </div>
                    <div class="cancellation-info--outer">
                      <div class="cancellation-info--inner">
                        <div
                          v-if="!cancellation_fee"
                          class="cancel-reason-subtitle"
                          id="cancel-reason-subtitle"
                        >
                          {{$t('general.incur_cancelation_cost')}}
                        </div>
                        <div v-else class="cancel-reason-subtitle" id="cancel-reason-subtitle">
                          <i class="el-icon-warning warning-cancellation-icon"></i>
                          {{ getCancellationInfo() }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-for="reasons in cancellation_reasons">
                    <div class="cancel-reason-text" id="cancel-reason-text">
                      <div class="">
                        <el-radio v-model="cancel_reason" :label="reasons.cancel_reason_id">
                          {{ reasons.cancel_reason }}
                        </el-radio>
                      </div>
                    </div>
                  </div>
                  <div class="cancel-reason-input" v-if="cancel_reason === 0">
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      :placeholder="$t('general.tell_us_why_cancel')"
                      v-model="cancel_desc">
                    </el-input>
                  </div>
                  <div class="cancel-reason-input">
                    <input type="text" v-model="inputCancelReason" class="cancel-reason-text-input" name="" placeholder="Enter cancel reason" />
                  </div>
                  <div class="action--slide-desc">
                    <button
                      type="button"
                      name="button"
                      class="action--slide-button cancellation-submit accept-cancell-btn"
                      @click="cancelOrder()"
                    >
                      {{$t('general.yes_cancel')}}
                    </button>
                    <button
                      type="button"
                      name="button"
                      class="action--slide-button cancellation-submit"
                      @click="cancelToggle(true)"
                    >
                      {{$t('general.no_cancel')}}
                    </button>
                  </div>
                </div>
                <div class="cancelOptions--content-wrap" v-if="cancel_reason === 4">
                  <div class="cancelOptions--content-message">
                    {{$t('general.call_rider_and_right_destination')}}
                  </div>
                  <div class="cancelOptions--content-buttons">
                    <button
                      type="button"
                      name="button"
                      class="action--slide-button"
                      @click="cancelToggle(cancel_reason)"
                    >
                     {{$t('general.ok_call_rider')}}
                    </button>
                    <button
                      type="button"
                      name="button"
                      class="default action--slide-button"
                      @click="cancelOrder()"
                    >
                      {{$t('general.cancel_order')}}
                    </button>
                  </div>
                </div>
                <div class="cancelOptions--content-wrap" v-if="pop_state === 5">
                  <div class="warning-icon-pstn">
                    <i class="el-icon-warning warning-icon"></i>
                  </div>
                  <div class="cancelOptions--content-message pop-message">
                      {{$t('general.infuture_ensure_order_ready')}}
                  </div>
                  <div class="cancelOptions--content-buttons">
                    <button
                      type="button"
                      name="button"
                      class="action--slide-button pop_btn"
                      @click="disablePop()"
                    >
                      {{$t('general.ok_capital')}}
                    </button>
                  </div>
                </div>
                <div class="cancelOptions--content-wrap" v-if="pop_state === 13">
                  <div class="warning-icon-pstn">
                    <i class="el-icon-warning warning-icon"></i>
                  </div>
                  <div class="cancelOptions--content-message pop-message">
                     {{$t('general.preffered_rider_offline')}}
                  </div>
                  <div class="cancelOptions--content-buttons">
                    <button
                      type="button"
                      name="button"
                      class="action--slide-button pop_btn"
                      @click="disablePop()"
                    >
                      {{$t('general.ok_capital')}}
                    </button>
                  </div>
                </div>
              </el-dialog>

              <!-- Share ETA Dialog -->

              <el-dialog :visible.sync="shareOption" class="cancelOptions">
                <div class="">
                  <div class="share-text-option share-order-option share-notification-extend">
                    {{$t('general.share_eta_via_sms')}}
                  </div>
                  <div class="share-eta-divider"></div>
                  <div class="share-text-option share-notification-extend share-eta-input-header">
                    {{$t('general.recipient_phone_number')}}
                  </div>
                </div>
                <div class="share-notification-extend share-eta-input">
                  <el-input
                    v-model.trim="recipientPhone"
                    :min="0"
                    type="number"
                    autocomplete="true"
                    class="share-input-layout"
                  />
                </div>

                <div class="share-notification-extend eta-button-align">
                  <button
                    type="button"
                    name="button"
                    class="action--slide-button input-phone"
                    @click="shareETASms()"
                  >
                    {{$t('general.submit')}}
                  </button>
                </div>
              </el-dialog>

              <!-- Edit Order Dialog -->

              <el-dialog :visible.sync="editLocationOption" class="cancelOptions">
                <div class="cancel-reason-title" id="cancel-reason-title">
                  Add or change locations
                </div>
                <div class="cancel-reason-description">
                  You may incur cost on updating locations
                </div>
                <div
                  ref="scrollable_locations"
                  class="homeview--form homeview--row homeview--form__scrollable edit-location-inner"
                >
                  <div class="homeview--input-bundler">
                    <no-ssr placeholder="">
                      <font-awesome-icon
                        icon="circle"
                        size="xs"
                        class="homeview--row__font-awesome-edit homeview--input-bundler__img .homeview--input-bundler__destination-input sendy-orange"
                        width="10px"
                      />
                      <gmap-autocomplete
                        v-model="locations[0]"
                        :options="map_options"
                        placeholder="Enter a pickup location"
                        :select-first-on-enter="true"
                        class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"
                        @place_changed="setLocation($event, 0)"
                        @keyup="checkChangeEvents($event, 0)"
                        @change="checkChangeEvents($event, 0)"
                      />
                      <font-awesome-icon
                        icon="times"
                        size="xs"
                        class="homeview--row__font-awesome homeview--input-bundler__img-right-pickup     "
                        width="10px"
                        @click="clearLocation(0)"
                      />
                    </no-ssr>
                  </div>

                  <div class="homeview--destinations">
                    <div class="homeview--input-bundler">
                      <no-ssr placeholder="">
                        <font-awesome-icon
                          icon="circle"
                          size="xs"
                          class="homeview--row__font-awesome-edit homeview--input-bundler__img sendy-blue"
                          width="10px"
                        />
                        <gmap-autocomplete
                          v-model="locations[1]"
                          :options="map_options"
                          placeholder="Enter a destination location"
                          :select-first-on-enter="true"
                          class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"
                          @place_changed="setLocation($event, 1)"
                          @keyup="checkChangeEvents($event, 1)"
                          @change="checkChangeEvents($event, 1)"
                        />
                        <font-awesome-icon
                          icon="times"
                          size="xs"
                          class="homeview--row__font-awesome homeview--input-bundler__img-right-pickup "
                          width="10px"
                          @click="clearLocation(1)"
                        />
                      </no-ssr>
                    </div>
                  </div>

                  <div
                    v-for="n in get_extra_destinations"
                    :key="n + 1"
                    class="homeview--destinations"
                    :data-index="n + 1"
                  >
                    <div class="homeview--input-bundler">
                      <no-ssr placeholder="">
                        <font-awesome-icon
                          icon="circle"
                          size="xs"
                          class="homeview--row__font-awesome-edit homeview--input-bundler__img sendy-blue"
                          width="10px"
                        />
                        <gmap-autocomplete
                          v-model="locations[n + 1]"
                          :options="map_options"
                          placeholder="Enter a destination location"
                          :select-first-on-enter="true"
                          class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input"
                          @place_changed="setLocation($event, n + 1)"
                          @keyup="checkChangeEvents($event, (n = 1))"
                          @change="checkChangeEvents($event, n + 1)"
                        />
                        <font-awesome-icon
                          icon="times"
                          size="xs"
                          class="homeview--row__font-awesome homeview--input-bundler__img-right "
                          width="10px"
                          @click="removeExtraDestinationWrapper(n + 1)"
                        />
                      </no-ssr>
                    </div>
                  </div>
                </div>
                <div
                  v-if="allow_add_destination"
                  class="homeview--row homeview--row__more-destinations homeview-locations-options edit-location-inner"
                >
                  <div class="homeview-locations-options--add-destination">
                    <font-awesome-icon
                      icon="plus"
                      size="xs"
                      class="sendy-blue homeview--row__font-awesome"
                      width="10px"
                    />
                    <a class="homeview--add" @click="addExtraDestinationWrapper()"
                      >Add Destination</a
                    >
                  </div>
                </div>
                <div
                  v-if="location_loading"
                  v-loading="location_loading"
                  class="orders-loading-container"
                />

                <div
                  class="homeview--row homeview--row__more-destinations
                 homeview-locations-options location-notify"
                  v-if="!price_request_validity && !location_loading"
                >
                  <div class="cancellation-info--outer">
                    <div class="cancellation-info--inner">
                      <div class="cancel-reason-subtitle" id="cancel-reason-subtitle">
                          {{message}}
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="show_price_split && price_request_validity && !location_loading">
                  <div class="price-split-separator">
                    <div class="price-estimate-header">
                      <i class="el-icon-circle-check price-summary-icon"></i>Price update
                    </div>
                  </div>

                  <div
                    class="homeview--row homeview--row__more-destinations homeview-locations-options location-notify"
                  >
                    <div class="price-split-container">
                      <div class="price-split-info">
                        <div class="price-split-icon-container">
                          Total order cost
                        </div>
                        <div class="price-split-estimate-value">
                          <p class="">
                            {{ order_currency
                            }}<span class="price-split-currency-highlight">{{ new_cost }}</span>
                          </p>
                        </div>
                      </div>
                      <div class="price-split-info">
                        <div class="price-split-icon-container">
                          Amount paid
                        </div>
                        <div class="price-split-estimate-value">
                          <p class="">
                            {{ order_currency
                            }}<span class="price-split-currency-highlight">{{
                              tracking_data.amount
                            }}</span>
                          </p>
                        </div>
                      </div>
                      <div class="price-split-info">
                        <div class="price-split-icon-container price-split-info-cost">
                          Amount due
                        </div>
                        <div class="price-split-estimate-value">
                          <p class="price-split-info-cost">
                            {{ order_currency
                            }}<span class="price-split-currency-highlight">{{
                              getAmountDue
                            }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="payment-methods-section">
                    <div class="">
                      <div class="payments-cursor" @click="do_set_payment_option()">
                        <a>
                          <span class="">
                            Payment options
                          </span>
                          <font-awesome-icon icon="chevron-down" :class="revertIcon" width="15px" />
                        </a>
                      </div>
                      <div v-if="paymentStatusOption" class="home-view-actions--note">
                        <div class="" />
                        <div class="home-view-notes-wrapper">
                          <div v-if="show_payment" class="">
                            <span v-if="getOrderPaymentMethod === 1">
                              <div
                                v-for="method in payment_methods"
                                :key="method.payment_method_id"
                                class="home-view-notes-wrapper--item home-view-notes-wrapper--item__row"
                              >
                                <div class="home-view-notes-wrapper--item__option">
                                  <div
                                    class="home-view-notes-wrapper--item__option-div payment__radio-button-label"
                                  >
                                    <input
                                      v-model="payment_method"
                                      type="radio"
                                      :value="method.payment_method_id"
                                      name="paymentOptions"
                                      class="payment__radio-button"
                                    />
                                    <span class="payment-options-alignment">
                                      <p class="no-margin">{{ method.name }}</p>
                                    </span>
                                  </div>
                                </div>
                                <div class="home-view-notes-wrapper--item__value" />
                              </div>


                              <div v-if="display_cards" class="card-accounts-list">
                                <div class="payment-options-cards-container">
                                  <div v-if="!addCardStatus && get_saved_cards.length > 0">
                                    <div v-if="deletedCardIndex === ''">
                                      <p class="payment-options-cards-title">Saved Cards</p>
                                      <div
                                        v-for="(cards, index) in get_saved_cards"
                                        :key="index"
                                        class="payment-options-saved-cards-row"
                                      >
                                        <input
                                          v-model="activeSavedCard"
                                          :value="index"
                                          type="radio"
                                          class="payment-options-saved-card-radio"
                                        />
                                        {{ formatCardNumber(cards.card) }}
                                        <font-awesome-icon
                                          icon="trash-alt"
                                          class="payment-options-delete-card-icon"
                                          @click="deletedCardIndex = index"
                                        />
                                      </div>
                                      <div
                                        class="payment-options-add-card-holder"
                                        @click="addCardStatus = !addCardStatus"
                                      >
                                        <span>
                                          <font-awesome-icon
                                            icon="plus-circle"
                                            class="payment-options-add-card-icon"
                                          />
                                        </span>
                                        <span class="payment-options-add-card">Add a new Card</span>
                                      </div>
                                    </div>
                                    <div v-else class="delete-saved-card-dialogue">
                                      <p class="delete-saved-card-dialogue-label">
                                        Are you sure you want to delete this card
                                        <strong>{{ get_saved_cards[deletedCardIndex].card }}</strong
                                        >?
                                      </p>
                                      <p class="delete-saved-card-dialogue-label">
                                        <span
                                          class="delete-saved-card-dialogue-buttons"
                                          @click="deleteSavedCard(deletedCardIndex)"
                                          >Yes</span
                                        >
                                        <span
                                          class="delete-saved-card-dialogue-buttons"
                                          @click="deletedCardIndex = ''"
                                          >No</span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                  <form
                                    v-else
                                    class="VGS-form"
                                    @submit.prevent="onSubmit"
                                  >
                                    <span
                                      v-if="get_saved_cards.length > 0"
                                      class="payment-options-cards-title back-option"
                                      @click="addCardStatus = !addCardStatus"
                                    >
                                      <font-awesome-icon
                                        icon="arrow-left"
                                        class="payment-options-add-card-icon"
                                      />
                                      Back
                                    </span>
                                    <p class="payment-options-cards-title">Add a new card</p>
                                    <div
                                      id="cc-number"
                                      class="form-group"
                                    >
                                      <div class="form-control-static">
                                        <span class="fake-input-1" />
                                      </div>
                                    </div>
                                    <div class="cvv-expire-fields">
                                      <div
                                        id="cc-expiration-date"
                                        class="form-group"
                                      >
                                        <div class="form-control-static">
                                          <span class="fake-input-1" />
                                        </div>
                                      </div>
                                      <div
                                        id="cc-cvc"
                                        class="form-group"
                                      >
                                        <div class="form-control-static">
                                          <span class="fake-input-1" />
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      id="cc-save-card-1"
                                      class="form-group"
                                    >
                                      <div class="form-control-static">
                                        <input
                                          v-model="saveCardState"
                                          type="checkbox"
                                        >
                                        <span
                                          class="fake-checkbox-label-1"
                                        >I want to save my card for future orders</span>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>


                              <div v-if="!getCardPaymentStatus">
                                <p
                                  v-if="country === 'KE'"
                                  class="card-option-disabled-notification"
                                >
                                  Dear {{ user_name }}, <br />
                                  Card payments will be momentarily unavailable as we undergo
                                  technical maintenance. You can still pay for your Sendy deliveries
                                  using M-Pesa, or pay cash upon delivery. Contact Support on
                                  +254709779779 for any queries.
                                </p>
                                <p
                                  v-if="country === 'UG'"
                                  class="card-option-disabled-notification"
                                >
                                  Dear {{ user_name }}, <br />
                                  Card payments will be momentarily unavailable as we undergo
                                  technical maintenance. Contact Support on +256393239706 for any
                                  queries.
                                </p>
                              </div>


                            </span>
                          </div>
                          <span v-else-if="getOrderPaymentMethod === 2">
                            <div class="edit-locations-payments--postpay">
                              <p>This is a postpay account</p>
                              <p>The delivery costs will be added to your balance.</p>
                            </div>
                          </span>
                          <span v-else>
                            <div class="edit-locations-payments--postpay">
                              <p>The delivery costs will be charged from your balance.</p>
                            </div>
                          </span>
                        </div>
                      </div>

                      <div
                        v-if="loading_payment"
                        v-loading="loading_payment"
                        class="edit-payment-loading-container"
                      />

                      <div v-if="show_price_split && price_request_validity
                        && !location_loading && !loading_payment">
                        <button
                          type="button"
                          class="button-primary edit-locations--place-order"
                          name="button"
                          @click="updateLocations()"
                        >
                          Update Locations
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </el-dialog>

              <el-dialog
               :visible.sync="editInstructionsOption"
                width="30%"
                class="updateNotificationsDialog"
                :modal-append-to-body="false"
              >
                <div class="add-instructions-outer">
                  <p class="add-instructions-setup">
                    {{ editInstructionsOuterLabel() }}
                  </p>
                  <div class="">
                    <div
                      class="instructions--inner-section"
                    >
                      <div class="">
                        <div class="" />
                        <div class="">
                          <textarea
                            v-model="editedNotes"
                            name="name"
                            rows="5"
                            class="textarea-control add-notes"
                            placeholder="Instructions"
                          />
                        </div>
                      </div>
                      <div class="">
                        <div class="add-instructions-setup-contact">
                          Contact person
                        </div>
                        <div class="" />
                        <div
                          class=""
                        >
                          <vue-tel-input
                            v-model.trim="editedContact"
                            v-validate="'required|check_phone'"
                            class="input-control sign-up-form"
                            type="number"
                            name="phone"
                            value=""
                            data-vv-validate-on="blur"
                            v-bind="phoneInputProps"
                            @onBlur="validate_phone"
                          />
                        </div>
                      </div>
                      <div class="notify_recipient">
                        <input
                          type="checkbox"
                          name="u_terms"
                          class="send_sms-checkbox"
                          v-model="send_sms"
                        />
                        <span>
                          Notify them of the pickup via SMS
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="">
                    <div class="">
                      <input
                        class="button-primary add-instructions-submit"
                        type="submit"
                        value="Update Instructions"
                        @click="saveUpdatedInstructions()"
                      />
                    </div>
                  </div>
                </div>
              </el-dialog>

              <el-dialog
               :visible.sync="editScheduledTimeOption"
                width="30%"
                class="updateNotificationsDialog scheduleDialog"
                :modal-append-to-body="false"
              >
                <div class="add-instructions-outer">
                  <p class="add-instructions-setup schedule_time_outer">
                    Schedule pick up time of the order
                  </p>
                  <div class="">
                    <div
                      class="instructions--inner-section"
                    >
                      <div class="">
                        <div
                          class=""
                        >
                          <el-date-picker
                            v-model="schedule_time"
                            class="vendor_component-actions__element-date"
                            type="datetime"
                            format="dd-MM-yyyy h:mm a"
                            placeholder="As soon as possible"
                            prefix-icon="el-icon-date"
                            :default-time="default_value"
                            :picker-options="dueDatePickerOptions"
                            @change="dispatchScheduleTime"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="">
                    <div class="">
                      <input
                        class="button-primary add-instructions-submit"
                        type="submit"
                        value="Schedule order"
                        @click="updateScheduledTime()"
                      />
                    </div>
                  </div>
                </div>
              </el-dialog>

            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters ,mapMutations} from 'vuex';
import TimezoneMxn from '../../../../../mixins/timezone_mixin';
import EventsMixin from '../../../../../mixins/events_mixin';
import NotificationMxn from '../../../../../mixins/notification_mixin';
import InterCountyWindow from './InterCountyWindow.vue';
import FooterSection from './InfoBarSegments/InfoBarFooterComponent.vue';
import HeaderSection from './InfoBarSegments/InfoBarHeaderComponent.vue';
import LocationsSection from './InfoBarSegments/InfoBarLocationsComponent.vue';
import InstructionsSection from './InfoBarSegments/InfoBarInstructionsComponent.vue';
import OrderTimelineSection from './InfoBarSegments/InfoBarOrderTimelineComponent.vue';


const moment = require('moment');

export default {
  name: 'InfoWindow',
  components: {
   'no-ssr': NoSSR,
    InterCountyWindow,
    FooterSection,
    HeaderSection,
    LocationsSection,
    InstructionsSection,
    OrderTimelineSection,
  },
  mixins: [TimezoneMxn, EventsMixin, NotificationMxn, Mcrypt, PaymentMxn],
  data() {
    return {
      loading: true,
      order_number: '',
      cancel_popup: 0,
      cancel_reason: -1,
      cancel_desc: '',
      maximiseInfo: 0,
      cancelOption: false,
      inputCancelReason: '',
      paymentOption: '',
      user_state: false,
      isSaved: false,
      shareOption: false,
      recipientPhone: '',
      externalTracking: false,
      small_vendors: [1],
      setScheduled: false,
      hubspotStatus: true,
      cancellation_reasons : [],
      cancellation_state : false,
      more_info : false ,
      other_notes : '',
      pop_state : -1 ,
      cancellation_fee : false,
      cancellation_amount : 0 ,
      cancellation_message : '',
    };
  },
  computed: {
    ...mapGetters({
      tracking_data: '$_orders/$_tracking/getTrackingData',
      tracked_order: '$_orders/$_tracking/getTrackedOrder',
      isMQTTConnected: '$_orders/$_tracking/getIsMQTTConnected',
      vendors: '$_orders/getVendors',
      getShareOption: '$_orders/$_tracking/getShareOption',
      getTrackMoreInfo: '$_orders/$_tracking/getTrackMoreInfo',
      getTrackVendorName: '$_orders/$_tracking/getTrackVendorName',
      getConfirmEta: '$_orders/$_tracking/getConfirmEta',
      getPickUpEta: '$_orders/$_tracking/getPickUpEta',
      getDeliveryEta: '$_orders/$_tracking/getDeliveryEta',
    }),
    order_is_scheduled() {
      return this.moment(this.current_time).isBefore(this.schedule_time);
    },
    current_time() {
      return this.moment().format('YYYY-MM-DD HH:mm:ss');
    },
    scheduled_time() {
      return this.moment(this.schedule_time, 'YYYY-MM-DD HH:mm:ss Z').format(
        'YYYY-MM-DD HH:mm:ss',
      );
    },
    allow_add_destination() {
      return (
        !this.location_loading
        && Array.isArray(this.getStoreOrderPath)
        && this.getStoreOrderPath.length - 1 <= this.get_max_destinations
        && this.getStoreOrderPath.length > 1
        && this.get_extra_destinations <= this.getStoreOrderPath.length - 2
      );
    },
    hide_payment() {
      return (
        this.tracking_data.payment_method === 12
        || this.getRunningBalance - this.getAmountDue >= 0
      );
    },
    getAmountDue(){

      return (this.new_cost - this.tracking_data.amount) ;

    },

    show_payment() {
      return !this.hide_payment;
    },
    revertIcon() {
      return {
        'sendy-blue': true,
        'rotate-transform': true,
        rotate: this.payment_check === 'payment',
      };
    },
    paymentStatusOption() {
      let resp = false;

      if (this.payment_check === 'payment') {
        resp = true;
      }
      return resp;
    },
    getOrderPaymentMethod(){
      return this.tracking_data.payment_option ;
    },
    display_cards() {
      return this.payment_method === 2;
    },
    user_name() {
      const session = this.$store.getters.getSession;
      return session[session.default].user_name.split(' ')[0];
    },
    getStatus() {
      if (!this.loading) {
        switch (this.tracking_data.delivery_status) {
          case 3: {
            return this.$t('general.delivered');
          }
          case 2: {
            return this.$t('general.in_transit');
          }
          default: {
            switch (this.tracking_data.confirm_status) {
              case 1: {
                return this.$t('general.confirmed');
              }
              default: {
                return this.$t('general.pending');
              }
            }
          }
        }
      } else {
        return '';
      }
    },
    getStatusCode() {
      if (!this.loading) {
        switch (this.tracking_data.delivery_status) {
          case 3: {
            return 3;
          }
          case 2: {
            return 2;
          }
          default: {
            switch (this.tracking_data.confirm_status) {
              case 1: {
                return 1;
              }
              default: {
                return 0;
              }
            }
          }
        }
      } else {
        return '';
      }
    },
    deliveryStatus(name) {
      let status = this.tracking_data.delivery_status;
      let text = '';
      if (status < 3) {
        text = this.$t('general.package_on_the_way') + name;
      } else {
        text = this.$t('general.package_has_been_delivered');
      }
      return text;
    },
  },
  watch: {
    '$route.params.order_no': function trackedOrder(from) {
      this.order_number = from;
      this.loading = true;
      this.$store.commit('$_orders/$_tracking/setTrackedOrder', from);
      this.poll(from);
      this.initiateOrderData();
    },
    cancelOption: function cancelOption() {
      if (this.cancelOption === false) {
        let eventPayload = {
          eventCategory: 'Order Cancellation',
          eventAction: 'Click',
          eventLabel: 'No Button - Order Cancellation Page - WebApp',
        };
        this.fireGAEvent(eventPayload);
      }
    },
    shareOption(val){
      if (!val) {
        this.setShareOption(false);
      }
    },
    tracking_data(data) {
      if (data !== undefined) {
        if (Object.prototype.hasOwnProperty.call(data, 'confirm_status')) {
          if (data.confirm_status === 1) {
            this.reCheckMQTTConnection();
          }
        }
      }
      this.initiateOrderData();
    },
    inputCancelReason(data) {
      if (data) {
        this.cancel_reason = 11;
        this.cancel_desc = data;
        this.debounceCancelReason(data);
      } else {
        this.cancel_reason = -1;
        this.cancel_desc = '';
      }
    },
    cancel_reason(value){
      if (value !== '') {
        this.cancelChange(value);
      }

    },
    getShareOption(value){
      this.shareOption = value
    },
  },
  mounted() {
    this.loading = true;
    this.$store.commit('$_orders/$_tracking/setTrackedOrder', this.$route.params.order_no);
    this.poll(this.$route.params.order_no);
    this.initiateOrderData();
  },
  created() {
    this.order_number = this.$route.params.order_no;
    this.checkPreviousRoute();
  },
  methods: {
    ...mapMutations({
      hide_vendors: '$_orders/hideVendors',
      clearVendorMarkers: '$_orders/clearVendorMarkers',
      setShareOption: '$_orders/$_tracking/setShareOption',
      setTrackMoreInfo: '$_orders/$_tracking/setTrackMoreInfo',
      setTrackVendorName: '$_orders/$_tracking/setTrackVendorName',
      setTrackPartnerName: '$_orders/$_tracking/setTrackPartnerName',
      setTrackPackageName: '$_orders/$_tracking/setTrackPackageName',
      setConfirmEta: '$_orders/$_tracking/setConfirmEta',
      setPickUpEta: '$_orders/$_tracking/setPickUpEta',
      setDeliveryEta: '$_orders/$_tracking/setDeliveryEta',
    }),
    dispatchScheduleTime(){
      this.default_value = this.moment(this.schedule_time).format('HH:mm:ss');
    },
    // eslint-disable-next-line func-names
    debounceCancelReason: _.debounce(function (data) {
      this.fireGAEvent({
        eventCategory: 'Order Cancellation',
        eventAction: 'Click',
        eventLabel: 'Enter cancel reason input - Order Cancellation Page - WebApp',
      });
    }, 500),
    cancelChange(reason) {
      this.more_info = false ;
      this.cancel_desc = '';
      const data = this.cancellation_reasons.find(position => position.cancel_reason_id === reason);
      if (reason === 0) {
        this.more_info = true ;
      }
      else {
        this.cancel_desc = data.cancel_reason;
      }
    },
    initiateOrderData() {
      if (this.tracking_data !== undefined) {
        if (Object.keys(this.tracking_data).length > 0) {
          if (this.tracking_data.rider.vendor_id !== 26) {
            this.setRiderLocationToStore();
          }
          this.checkVendorName();
          this.orderETA();
          this.confirmUser();
        }
      }
    },
    checkPreviousRoute() {
      if (this.$route.path === `/external/tracking/${this.$route.params.order_no}`) {
        this.setTrackMoreInfo(false);
        this.externalTracking = true;
      }
    },
    poll(from) {
      if (this.tracking_data !== undefined) {
        const that = this;
        this.$store
          .dispatch('$_orders/$_tracking/getTrackingData', { order_no: from })
          .then((response) => {
            if (response) {
              if (this.tracking_data.delivery_status === 3) {
                that.doNotification('1', this.$t('general.order_delivered'), this.$t('general.order_has_been_delivered'));
                if (that.$route.name !== 'tracking_external') {
                  that.$router.push(`/orders/rating/${from}`);
                } else {
                  that.$router.push(`/external/rating/${from}`);
                }
              } else if (this.tracking_data.main_status === 2) {
                that.doNotification('2', this.$t('general.order_cancelled'), this.$t('general.order_has_been_cancelled'));
                that.place();
              } else if (this.tracked_order === from) {
                setTimeout(() => {
                  that.poll(from);
                }, 30000);
              }
            } else {
              that.place();
            }
            that.loading = false;
          });
      }
    },
    cancelToggle(cancelReason = 0) {
      if (cancelReason === true) {
        let eventPayload = {
             eventCategory: 'Order Cancellation',
              eventAction: 'Click',
              eventLabel: 'No Button - Order Cancellation Page - WebApp',
          }
          this.fireGAEvent(eventPayload);

      }
      if(cancelReason === '4') {
          this.trackMixpanelEvent('Dissuaded Cancellation ', {
              'Order No': this.tracking_data.order_no,
          });
      }
      if (this.cancel_popup === 1) {
        this.cancel_popup = 0;
      } else {
        this.cancel_popup = 1;
      }
      this.cancelOption = false;
      this.cancel_reason = '';
      if (cancelReason === true) {
        let eventPayload = {
          eventCategory: 'Order Cancellation',
          eventAction: 'Click',
          eventLabel: 'No Button - Order Cancellation Page - WebApp',
        };
        this.fireGAEvent(eventPayload);
      }
      if (cancelReason === '4') {
        this.trackMixpanelEvent('Dissuaded Cancellation ', {
          'Order No': this.tracking_data.order_no,
        });
      }
      if (this.cancel_popup === 1) {
        this.cancel_popup = 0;
      } else {
        this.cancel_popup = 1;
      }
      this.cancelOption = false;
      this.cancel_reason = '';
    },
    maximiseInfoDetails() {
      this.setTrackMoreInfo(true);
    },
    checkVendorName() {
      if (
        Object.keys(this.tracking_data).length > 0 &&
        Object.prototype.hasOwnProperty.call(this.tracking_data.rider, 'vendor_name')
      ) {
        if (this.tracking_data.rider.vendor_name === 'Bike') {
          this.setTrackPartnerName('rider');
          this.setTrackPackageName('package');
          if (this.tracking_data.price_type === 3) {
            this.setTrackVendorName('Standard');
          } else {
            this.setTrackVendorName('Express');
          }
        } else if (this.tracking_data.rider.vendor_name === 'Economy Bike') {
          this.setTrackVendorName('Standard');
          this.setTrackPartnerName('rider');
          this.setTrackPackageName('package');
        } else {
          this.setTrackVendorName(this.tracking_data.rider.vendor_name);
          this.setTrackPartnerName('driver');
          this.setTrackPackageName('load');
        }
      }
    },
    confirmUser() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0 &&
        Object.prototype.hasOwnProperty.call(session, 'default')
      ) {
        let sessionUserEmail = session[session.default].user_email;
        let orderUserEmail = this.tracking_data.user.email;

        if (sessionUserEmail === orderUserEmail) {
          this.user_state = true;
          this.retrieveCancellationReasons();
        } else {
          this.user_state = false;
        }
      }
    },
    canceldialog() {

      const payload = {
        "order_no" : this.tracking_data.order_no
      };
      this.$store.dispatch('$_orders/$_tracking/computeCancellationFee', payload).then(
        (response) => {
          if (response.data.cancellation_fee === 0) {
            this.cancellation_fee = false ;
            this.cancellation_amount = 0 ;
            this.cancellation_message = '';
          }
          else {
            this.cancellation_fee = true ;
            this.cancellation_amount = response.data.cancellation_fee ;
            this.cancellation_message = response.data.description ;
          }
          this.cancelOption = true;
          this.cancel_reason = '';
        },
        () => {
          this.cancellation_fee = false ;
          this.cancelOption = false;
          this.cancel_reason = '';
        }
      );
    },
    getCancellationInfo(){

      let text = this.$t('general.incur_cancellation_fee_of') + this.tracking_data.currency + this.cancellation_amount + `, ${this.$t('general.ensure_order_details_ready')}`;

      if (this.getStatus === 'Confirmed') {
        text = `${this.$t('general.note_you_will_be_charged')} ${this.tracking_data.currency} ${this.cancellation_amount} ${this.$t('general.for_cancelling_order')}`;
      }

      return text ;
    },
    place() {
      this.pop_state = false ;
      if (this.$route.name !== 'tracking_external') {
        this.$router.push('/orders');
      } else {
        this.$router.push('/');
      }
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
    cancelOrder() {
      if (this.cancel_reason !== '' && Object.keys(this.$store.getters.getSession).length > 0) {
        if (this.cancel_reason === 0 && this.cancel_desc === '') {
          this.doNotification(3, this.$t('general.order_cancellation_failed'), this.$t('general.provide_reason_for_cancellation'));
        }
        else {
          this.pop_state = this.cancel_reason;
          setTimeout(() => {
           this.pop_state = false ;
          }, 3000);
          const payload = {
            order_no: this.tracking_data.order_no,
            cancel_reason_id: this.cancel_reason,
            reason_description: this.cancel_desc,
            client_type: this.$store.getters.getSession.default,
          };
          const that = this;
          if (this.inputCancelReason && this.hubspotStatus) {
            this.submitHubspotCancelReason();
            this.fireGAEvent({
              eventCategory: 'Order Cancellation',
              eventAction: 'Click',
              eventLabel: 'Submit cancel reason input - Order Cancellation Page - WebApp',
            });
          }
          let eventPayload = {
            eventCategory: 'Order Cancellation',
            eventAction: 'Click',
            eventLabel: 'Yes Button - Order Cancellation Page - WebApp',
          };
          this.fireGAEvent(eventPayload);

          this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload).then((response) => {
            if (response.status) {
              that.doNotification('1', this.$t('general.order_cancelled'), this.$t('general.order_cancelled_succesfully'));
              that.cancelToggle();
              this.$store.dispatch('$_orders/fetchOngoingOrders');
              that.place();
            } else {
              const payload2 = {
                order_no: that.$route.params.order_no,
                cancel_reason_id: 4,
                reason_description: 'I placed the wrong locations',
                client_type: that.$store.getters.getSession.default,
              };
              this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload2).then((response2) => {
                if (response2.status) {
                  that.doNotification('1', this.$t('general.order_cancelled'), this.$t('general.order_cancelled_succesfully'));
                  that.cancelToggle();
                  this.$store.dispatch('$_orders/fetchOngoingOrders');
                  that.place();
                } else {
                  that.doNotification(
                    2,
                    this.$t('general.order_cancellation_failed'),
                    this.$t('general.not_cancel_order_contact_support')
                  );
                }
              });
            }
          });
        }
      } else {
        this.doNotification(3, this.$t('general.order_cancellation_failed'), this.$t('general.select_cancellaton_reason'));
      }
    },
    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
          // this.$ga.event({
          //   eventCategory: 'Orders',
          //   eventAction: 'Price Request',
          //   eventLabel: name,
          //   eventValue: 14,
          // });
        }
      } catch (er) {
        // ...
      }
    },
    saveDetails() {
      let sessionData = this.$store.getters.getSession;
      let params = {};

      if (sessionData.default === 'biz') {
        // create cop payload
        params = {
          cop_id: sessionData.biz.cop_id,
          order_no: this.$route.params.order_no,
          user_id: sessionData.biz.user_id,
        };
      } else {
        // create peer payload
        params = {
          cop_id: 0,
          order_no: this.$route.params.order_no,
          user_id: sessionData.biz.user_id,
        };
      }

      this.$store.dispatch('$_orders/$_tracking/saveOrderDetails', params).then(
        (response) => {
          if (response.status) {
            this.doNotification(1, this.$t('general.save_details'), this.$t('general.order_details_save_successfully'));
            this.isSaved = true;
          } else {
            this.doNotification(3, this.$t('general.save_details_failed'), this.$t('general.could_not_save_details'));
          }
        },
        (error) => {
          this.doNotification(2, this.$t('general.save_details_error'), this.$t('general.check_internet_connection'));
        }
      );
    },
    dateFormat(date) {
      return this.moment(date).calendar(null, {
        lastWeek: 'MMM-D hh:mm a',
        sameDay: '[Today] hh:mm a',
        nextDay: '[Tomorrow] hh:mm a',
        nextWeek: 'ddd',
        sameElse() {
          return 'MMM D, hh:mm a';
        },
      });
    },

    reCheckMQTTConnection() {
      if (!this.isMQTTConnected) {
        this.initiateMQTT();
      }
    },
    initiateMQTT(){
      if (this.tracking_data.rider.vendor_id !== 26) {
        this.$store.dispatch('$_orders/$_tracking/trackMQTT');
      }
      else {
        this.hide_vendors();
        this.clearVendorMarkers();
      }

    },
    shareETASms() {
      if (this.recipientPhone !== '' && this.recipientPhone.length > 9) {
        const payload = {};
        const track = `${window.location.origin}/external/tracking/${this.$route.params.order_no}`;
        const session = this.$store.getters.getSession;
        let userName = session[session.default].user_name;
        payload.phone = this.recipientPhone;
        payload.message = `Hi! ${userName} wants you to track their Sendy order here: ${track}`;

        this.$store.dispatch('$_orders/$_tracking/requestETASms', payload).then(
          (response) => {
            if (response.status === 200) {
              this.doNotification(1, this.$t('general.share_eta'), this.$t('general.sms_sent_successfully'));
              this.setShareOption(false);
            } else {
              this.doNotification(2, this.$t('general.share_eta_failed'), this.$t('general.eta_sms_not_sent'));
            }
          },
          (error) => {
            this.doNotification(2, this.$t('general.share_eta_error'), this.$t('general.check_internet_connetion'));
          }
        );
      } else {
        this.doNotification(2, this.$t('general.share_eta_failed'), this.$t('general.enter_valid_phone_no'));
      }
    },
    setRiderLocationToStore() {
      if (Object.prototype.hasOwnProperty.call(this.tracking_data, 'rider')) {
        const payload = {};

        payload.rider_id = [this.tracking_data.rider.rider_id];
        this.$store.dispatch('$_orders/$_tracking/requestRiderLastPosition', payload).then(
          (response) => {
            if (response.status === 'true') {
              let riderOnlineData = response.partnerArray[0];
              const size = Object.keys(this.vendors).length;
              if (size > 0) {
                this.initiateMQTT();
              } else {
                riderOnlineData.overide_visible = true;
                this.$store.commit('$_orders/setVendorMarkers', riderOnlineData);
              }
            } else {
              this.initiateMQTT();
            }
          },
          (error) => {
            // ...
          }
        );
      }
    },
    orderETA() {
      if (Object.keys(this.tracking_data).length > 0) {
        if (this.tracking_data.rider.vendor_id !== 26) {
          if (this.tracking_data.confirm_status === 0) {
            const confirmEta = this.tracking_data.eta_data.etc;
            const etaSplit = confirmEta.split('to');
            const start = etaSplit[0].replace(/\s+/g, '');
            const end = etaSplit[1].replace(/\s+/g, '');

            const startEta = moment(start, moment.ISO_8601).format('h:mm a');
            const endEta = moment(end, moment.ISO_8601).format('h:mm a');

            this.setConfirmEta(`${startEta} - ${endEta}`);
            this.setPickUpEta('');
            this.setDeliveryEta('');
          } else if (
            this.tracking_data.confirm_status === 1 &&
            this.tracking_data.delivery_status === 0
          ) {
            const pickUpEta = this.tracking_data.eta_data.etp;
            const confirmedEta = this.tracking_data.eta_data.confirmed;
            const etaSplit = pickUpEta.split('to');
            const start = etaSplit[0].replace(/\s+/g, '');
            const end = etaSplit[1].replace(/\s+/g, '');

            const startEta = moment(start, moment.ISO_8601).format('h:mm a');
            const endEta = moment(end, moment.ISO_8601).format('h:mm a');

            this.setConfirmEta(moment(confirmedEta, moment.ISO_8601).format('h:mm a'));
            this.setPickUpEta(`${startEta}-${endEta}`);
          } else if (this.tracking_data.delivery_status === 2) {
            const deliveryEta = this.tracking_data.eta_data.etd;
            const confirmedEta = this.tracking_data.eta_data.confirmed;
            const pickedEta = this.tracking_data.eta_data.picked;
            const etaSplit = deliveryEta.split('to');
            const start = etaSplit[0].replace(/\s+/g, '');
            const end = etaSplit[1].replace(/\s+/g, '');

            const startEta = moment(start, moment.ISO_8601).format('h:mm a');
            const endEta = moment(end, moment.ISO_8601).format('h:mm a');

            this.setConfirmEta(moment(confirmedEta, moment.ISO_8601).format('h:mm a'));
            this.setPickUpEta(moment(pickedEta, moment.ISO_8601).format('h:mm a'));
            this.setDeliveryEta(`${startEta}-${endEta}`);
          } else if (this.tracking_data.delivery_status === 3) {
            const deliveryEta = this.tracking_data.eta_data.delivered;
            const confirmedEta = this.tracking_data.eta_data.confirmed;
            const pickedEta = this.tracking_data.eta_data.picked;


            this.setConfirmEta(moment(confirmedEta, moment.ISO_8601).format('h:mm a'));
            this.setPickUpEta(moment(pickedEta, moment.ISO_8601).format('h:mm a'));
            this.setDeliveryEta(moment(deliveryEta, moment.ISO_8601).format('h:mm a'));
          } else {
            // ...
          }
        }
      }
    },
    submitHubspotCancelReason() {
      this.hubspotStatus = false;
      const session = this.$store.getters.getSession;
      // eslint-disable-next-line global-require
      const portalId = '4951975';
      const formId = '396e6fb7-2bb9-4bae-a5e7-623983ecd97e';
      const fields = {
        fields: [
          {
            name: 'firstname',
            value: session[session.default].user_name,
          },
          {
            name: 'email',
            value: session[session.default].user_email,
          },
          {
            name: 'phone',
            value: session[session.default].user_phone,
          },
          {
            name: 'cancel_reason',
            value: this.inputCancelReason,
          },
        ],
      };
      const payload = {
        values: fields,
        app: 'HUBSPOT_URL',
        vm: this,
        endpoint: `${portalId}/${formId}`,
      };

      this.$store
        .dispatch('requestAxiosPost', payload)
        .then(response => response)
        .catch(err => err);
    },
    retrieveCancellationReasons(){
      this.$store.dispatch('$_orders/$_tracking/requestCancellationReasons').then(
        (response) => {
         if (response.status) {
           this.cancellation_reasons  = response.data ;
           this.cancellation_state = true ;
         }
         else {
            this.cancellation_state = false ;
         }
        },
        (error) => {
          this.cancellation_state = false ;
        }
      );
    },
    cancelBtnState(){
      if (this.tracking_data.delivery_status < 2 && this.user_state &&  this.cancellation_state) {
        return true ;
      }
      else {
        return false ;
      }
    },
    disablePop(){
      this.cancelToggle();
      this.pop_state = false ;
    },
    extendedDialog(){
      if (this.cancel_reason === 4 || this.pop_state === 5 ||this.pop_state === 13) {
        return false ;
      }
      else {
        return true ;
      }
    },
    interCountyInforBar(){
      let resp = false ;
      if (this.tracking_data !== undefined && Object.keys(this.tracking_data).length > 0) {
        if (this.tracking_data.rider.vendor_id === 26) {
          resp = true ;
        }
      }

      let value = {
        order_no: this.$route.params.order_no,
        client_type: 'corporate',
        waypoint_instructions : newData
      };

      const payload = {
        values: value,
        app: 'ORDERS_APP',
        endpoint: 'change_notes',
      };

      this.$store.dispatch('$_orders/$_tracking/requestEditOrder', payload).then(
        (response) => {
          if (response.status) {
            this.poll(this.$route.params.order_no);
            this.showNotesDialog(false);
            this.updateNotesInStore({});
            this.storedNotes = {};
            this.send_sms = false ;
            this.editedNotes = '';
            this.editedContact = '';

            this.doNotification(
              1,
              'Additional instructions updated successfully',
              '',
            );
          }
          else {
            this.doNotification(
              2,
              'Additional instructions update failed',
              'Please try again',
            );
          }
        },
        (error) => {
          this.doNotification(
            2,
            'Additional instructions update failed',
            'Additional instructions update failed. Please check your internet connection and try again.',
          );
        },
      );
    },
    disabledDueDate(date) {
      return date.getTime() < Date.now() - 8.64e7 || date.getTime() > Date.now() + 8.64e7 * 31;
    },
    updateScheduledTime(){
      if (this.schedule_time !== '') {

        let time = this.order_is_scheduled
          ? this.convertToUTC(this.scheduled_time)
          : this.convertToUTC(this.current_time);

        let scheduleTime = this.moment(time).utc().format('YYYY-MM-DD HH:mm:ss') ;

        let value = {
          order_no: this.$route.params.order_no,
          client_type: 'corporate',
          date_time : scheduleTime,
        };

        const payload = {
          values: value,
          app: 'ORDERS_APP',
          endpoint: 'schedule_order',
        };

        this.$store.dispatch('$_orders/$_tracking/requestEditOrder', payload).then(
          (response) => {
            if (response.status) {
              this.poll(this.$route.params.order_no);
              this.showScheduleTimeDialog(false);
              this.updatePickUpTimeInStore('');
              this.schedule_time = '';

      }
      return resp ;
    }
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../assets/styles/info_window_component.css";
</style>
