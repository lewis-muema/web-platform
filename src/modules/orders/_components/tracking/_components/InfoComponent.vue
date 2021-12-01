<template>
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
                  <div
                    class="infobar--content infobar--item infobar--driver infobar--item-bordered"
                  >
                    <div v-if="tracking_data.confirm_status > 0" class="infobar--driver-details">
                      <div class="">
                        {{ tracking_data.rider.rider_name }} - {{ tracking_data.rider.rider_phone }}
                      </div>
                      <div class="">
                        {{ tracking_data.rider.vehicle_name }}
                        {{ tracking_data.rider.number_plate }}
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
                        {{$t('general.minimum_amount')}} :
                        {{
                          tracking_data.price_tier.currency
                            ? tracking_data.price_tier.currency
                            : tracking_data.currency
                        }}
                        {{ tracking_data.package_details.customer_min_amount }}
                      </div>
                      <div v-else>
                        {{
                          tracking_data.price_tier.currency
                            ? tracking_data.price_tier.currency
                            : tracking_data.currency
                        }}
                        {{ tracking_data.amount }}
                      </div>
                    </div>
                    <div v-else>
                      {{
                        tracking_data.price_tier.currency
                          ? tracking_data.price_tier.currency
                          : tracking_data.currency
                      }}
                      {{ tracking_data.amount }}
                    </div>
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
                <div class="cancelOptions--content-wrap">
                  <div class="" v-if="!cancellation_step">
                    <div class="cancellation-title">
                      {{$t('general.cancel_order')}} ?
                    </div>
                    <div class="cancellation-info--outer">
                      <div class="cancellation-info--inner">
                        <font-awesome-icon
                          icon="exclamation-triangle"
                          size="xs"
                          class="warning-cancellation-triangle"
                          width="10px"
                        />
                        <div
                          v-if="!cancellation_fee"
                          class="cancel-reason-subtitle-new"
                          id="cancel-reason-subtitle"
                        >
                          {{$t('general.small_fee')}}
                        </div>
                        <div v-else class="cancel-reason-subtitle-new" id="cancel-reason-subtitle">
                          {{ getCancellationInfo() }}
                        </div>
                      </div>
                    </div>
                    <div class="cancellation-subheading">
                      {{$t('general.before_you_cancel')}}
                    </div>
                  </div>
                  <div v-if="!cancellation_step">
                    <div class="edit-information-outer">
                      <div class="cancellation-edit-options align-inner-bar" v-if="checkEditOption()">
                        <i class="el-icon-location edit-location-icon" />
                        <div>
                          {{$t('general.entered_wrong_locations')}}
                          <div class="cancellation-edit-inner" @click="showEditLocationsDialog()">
                            {{$t('general.edit_locations')}}
                          </div>
                        </div>
                      </div>

                      <div class="cancellation-edit-options align-inner-bar" v-if="checkScheduleOption()">
                        <font-awesome-icon
                          icon="clock"
                          size="xs"
                          class="edit-location-icon"
                          width="10px"
                        />
                        <div>
                          {{$t('general.not_available')}}
                          <div class="cancellation-edit-inner" @click="showEditPickUpTime()">
                          {{$t('general.schedule_order')}}
                          </div>
                        </div>
                      </div>

                      <div class="cancellation-edit-options align-inner-bar" v-if="checkScheduleOption()">
                        <i class="el-icon-question edit-location-icon" />
                          <div>
                            {{$t('general.isssue_with_order')}}
                            <div class="cancellation-edit-inner" @click="showFCWidget()">
                            {{$t('general.contact_support')}}
                            </div>
                          </div>
                      </div>

                    </div>
                    <div class="">
                      <div class="action--slide-desc">
                        <button
                          type="button"
                          name="button"
                          class="action--slide-button cancellation-submit accept-cancell-btn"
                          @click="cancelStep(true)"
                        >
                          {{$t('general.continue_cancel')}}
                        </button>
                        <button
                          type="button"
                          name="button"
                          class="action--slide-button cancellation-submit"
                          @click="cancelStep(false)"
                        >
                          {{$t('general.no_cancel')}}
                        </button>
                      </div>
                    </div>

                  </div>
                  <div v-if="cancellation_step">
                    <div class="cancel_step_back" @click="cancellation_step = false">
                      <font-awesome-icon
                        icon="arrow-left"
                      />
                      {{$t('general.back')}}
                    </div>
                    <div class="cancel-reason-title-name">
                      {{$t('general.why_cancel')}}
                    </div>
                    <div v-for="reasons in cancellation_reasons">
                      <div class="cancel-reason-text" id="cancel-reason-text">
                        <div class="">
                          <el-radio v-model="cancel_reason" :label="reasons.cancellation_reason_id">
                            {{ reasons.cancellation_reason }}
                          </el-radio>
                        </div>
                      </div>
                    </div>

                    <div class="cancel-reason-input" v-if="cancel_reason === 0">
                      <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4 }"
                        :placeholder="$t('general.tell_us_why_cancel')"
                        v-model="cancel_desc"
                      >
                      </el-input>
                    </div>

                    <div class="cancel-reason-input">
                      <input
                        type="text"
                        v-model="inputCancelReason"
                        class="cancel-reason-text-input"
                        name=""
                        :placeholder="$t('general.enter_cancel_reason')"
                      />
                    </div>

                    <div class="action--slide-desc-confirm">
                      <button
                        type="button"
                        name="button"
                        class="action--slide-button cancellation-submit submit-cancell-btn"
                        @click="cancelOrder()"
                      >
                        {{$t('general.submitCapital')}}
                      </button>
                      <button
                        type="button"
                        name="button"
                        class="action--slide-button cancellation-submit"
                        @click="cancelToggle(true)"
                      >
                        {{$t('general.dont_cancel')}}
                      </button>
                    </div>

                  </div>

                </div>
              </el-dialog>

              <!-- driver allocation dialogue -->
              <el-dialog :visible.sync="driverAllocatedOptions" class="driverOptions">
                <i class="el-icon-info cancelOptions--info-icon" />
                <div class="cancelOptions--info-message">
                  {{ cancelMessage }}
                </div>
                <div>
                  <p class="cancel-option-or-alt">{{ $t('general.or') }}</p>
                  <p class="cancel-option-confirm-alt" @click="cancelOrder()">{{ $t('general.cancel_order') }}</p>
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
                  {{$t('general.add_change_destination')}}
                </div>
                <div class="cancel-reason-description" v-if="cancelMessage && locationOptions">
                  {{ cancelMessage }}
                </div>
                <div class="cancel-reason-description" v-else>
                  {{$t('general.incur_cost_updating_loc')}}
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
                        class="input-control homeview--input-bundler__input input-control homeview--input-bundler__destination-input disabled-location-input"
                        @place_changed="setLocation($event, 0)"
                        @keyup="checkChangeEvents($event, 0)"
                        @change="checkChangeEvents($event, 0)"
                        disabled
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
                  <div class="location-divider" />
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
                          :placeholder="$t('general.enter_destination_location')"
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
                    <div class="location-divider" />
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
                          :placeholder="$t('general.enter_destination_location')"
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
                      >{{$t('general.add_destination')}}</a
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
                      <i class="el-icon-circle-check price-summary-icon"></i> {{$t('general.price_update')}}
                    </div>
                  </div>

                  <div
                    class="homeview--row homeview--row__more-destinations homeview-locations-options location-notify"
                  >
                    <div class="price-split-container">
                      <div class="price-split-info">
                        <div class="price-split-icon-container">
                          {{$t('general.total_order_cost')}}
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
                          {{$t('general.amount_paid')}}
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
                          {{$t('general.amount_due')}}
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
                            {{$t('general.payment_options')}}
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
                                      <p class="payment-options-cards-title">{{$t('general.saved_cards')}}</p>
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
                                        {{ formatCardNumber(cards.pay_method_details) }}
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
                                        <span class="payment-options-add-card">{{$t('general.add_new_card')}}</span>
                                      </div>
                                    </div>
                                    <div v-else class="delete-saved-card-dialogue">
                                      <p class="delete-saved-card-dialogue-label">
                                        {{$t('general.sure_delete_card')}}
                                        <strong>{{ get_saved_cards[deletedCardIndex].card }}</strong
                                        >?
                                      </p>
                                      <p class="delete-saved-card-dialogue-label">
                                        <span
                                          class="delete-saved-card-dialogue-buttons"
                                          @click="deleteSavedCard(deletedCardIndex)"
                                          >{{$t('general.yes')}}</span
                                        >
                                        <span
                                          class="delete-saved-card-dialogue-buttons"
                                          @click="deletedCardIndex = ''"
                                          >{{$t('general.no')}}</span
                                        >
                                      </p>
                                    </div>
                                  </div>
                                  <form
                                    v-else
                                    class="VGS-form"
                                    @submit.prevent="onSubmit"
                                  >
                                    <AdditionalCardFields 
                                      :additionalData="additionalData" 
                                      :transaction_id="transaction_id" 
                                      v-if="!loading_payment && showAdditionalCardFields" 
                                      @continue="handleContinue"
                                    />
                                    <div v-else>

                                      <span
                                        v-if="get_saved_cards.length > 0"
                                        class="payment-options-cards-title back-option"
                                        @click="addCardStatus = !addCardStatus"
                                      >
                                        <font-awesome-icon
                                          icon="arrow-left"
                                          class="payment-options-add-card-icon"
                                        />
                                        {{$t('general.back')}}
                                      </span>
                                      <p class="payment-options-cards-title">{{$t('general.add_new_card')}}</p>
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
                                          >{{$t('general.save_card_for_future_orders')}}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>
                              <div
                                class="loading-margin"
                                v-if="loading_payment"
                                v-loading="loading_payment"
                                :element-loading-text="transactionText"
                                element-loading-spinner="el-icon-loading"
                              >
                              </div>
                            </span>
                          </div>
                          <span v-else-if="getOrderPaymentMethod === 2">
                            <div class="edit-locations-payments--postpay">
                              <p>{{$t('general.post_pay_account')}}</p>
                              <p>{{$t('general.delivery_cost_added_to_balance')}}</p>
                            </div>
                          </span>
                          <span v-else>
                            <div class="edit-locations-payments--postpay">
                              <p>{{$t('general.delivery_cost_charged_from_balance')}}</p>
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
                          {{$t('general.update_locations')}}
                        </button>
                      </div>
                      <div v-if="locationOptions">
                        <p class="cancel-option-or-alt">{{ $t('general.or') }}</p>
                        <p class="cancel-option-confirm-alt" @click="cancelOrder()">{{ $t('general.cancel_order') }}</p>
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
                            :placeholder="$t('general.instructions_word')"
                            @blur="sendGA4Events(storedNotes.waypoint_type === 'PICKUP'? 'add_pick_up_instructions': 'add_drop_off_instructions', {delivery_notes: editedNotes})"
                          />
                        </div>
                      </div>
                      <div class="">
                        <div class="add-instructions-setup-contact">
                         {{$t('general.contact_person')}}
                        </div>
                        <div class="" />
                        <div
                          class=""
                        >
                          <vue-tel-input
                            v-model.trim="editedContact"
                            v-validate="'required|check_phone'"
                            class="input-control sign-up-form phone-input-display"
                            type="number"
                            name="phone"
                            value=""
                            data-vv-validate-on="blur"
                            v-bind="sendyPhoneProps"
                            :input-options="vueTelInputProps"
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
                          {{$t('general.notify_them_of_pickup')}}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="">
                    <div class="">
                      <input
                        class="button-primary add-instructions-submit"
                        type="submit"
                        :value="$t('general.update_instructions')"
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
                  <p class="add-instructions-setup schedule_time_outer-mod">
                    {{$t('general.reschedule_order')}}
                  </p>
                  <p class="schedule_time_message" v-if="cancelMessage && rescheduleOptions">
                    {{ cancelMessage }}
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
                            class="vendor_component-actions__element-date-mod"
                            type="datetime"
                            format="dd-MM-yyyy h:mm a"
                            :placeholder="$t('general.select_time_and_date')"
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
                        :class="schedule_time ? 'schedule-active-btn' : 'schedule-disabled-btn'"
                        class="button-primary add-instructions-submit-mod"
                        type="submit"
                        :value="$t('general.schedule_order')"
                        @click="updateScheduledTime()"
                      />
                    </div>
                  </div>
                  <div v-if="rescheduleOptions">
                    <p class="cancel-option-or-alt">{{ $t('general.or') }}</p>
                    <p class="cancel-option-confirm-alt" @click="cancelOrder()">{{ $t('general.cancel_order') }}</p>
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
import NoSSR from 'vue-no-ssr';
import { mapGetters, mapMutations ,mapActions} from 'vuex';
import TimezoneMxn from '../../../../../mixins/timezone_mixin';
import EventsMixin from '../../../../../mixins/events_mixin';
import NotificationMxn from '../../../../../mixins/notification_mixin';
import InterCountyWindow from './InterCountyWindow.vue';
import Mcrypt from '../../../../../mixins/mcrypt_mixin';
import PaymentMxn from '../../../../../mixins/payment_mixin';
import WaypointMxn from '../../../../../mixins/waypoint_mixin';
import FooterSection from './InfoBarSegments/InfoBarFooterComponent.vue';
import HeaderSection from './InfoBarSegments/InfoBarHeaderComponent.vue';
import LocationsSection from './InfoBarSegments/InfoBarLocationsComponent.vue';
import InstructionsSection from './InfoBarSegments/InfoBarInstructionsComponent.vue';
import OrderTimelineSection from './InfoBarSegments/InfoBarOrderTimelineComponent.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
import {
  faPlus,
  faMapMarkerAlt,
  faCircle,
  faClock,
  faPen,
  faDollarSign,
  faTimes,
  faMobileAlt,
  faStar,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { resolve } from 'path';

library.add(
  faPlus,
  faMapMarkerAlt,
  faCircle,
  faClock,
  faPen,
  faDollarSign,
  faTimes,
  faMobileAlt,
  faStar,
  faCcVisa,
  faCcMastercard,
  faExclamationTriangle,
);

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
    AdditionalCardFields: () => import('../../../../payment/_components/AdditionalCardFields.vue'),
  },
  mixins: [TimezoneMxn, EventsMixin, NotificationMxn, Mcrypt, PaymentMxn, WaypointMxn],
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
      setScheduled: false,
      hubspotStatus: true,
      cancellation_reasons: [],
      cancellation_state: false,
      more_info: false,
      other_notes: '',
      pop_state: -1,
      cancellation_fee: false,
      cancellation_amount: 0,
      cancellation_message: '',
      editLocationOption : false,
      editInstructionsOption : false,
      editScheduledTimeOption : false,
      storedNotes : {},
      show_destinations: false,
      location_loading: false,
      locations: [],
      fileUploadStatus: false,
      map_options: {
        componentRestrictions: {
          country: ['ke', 'ug', 'tz'],
        },
        bounds: {
          north: 35.6,
          east: 59.4,
          south: -28.3,
          west: -19.1,
        },
        strictBounds: true,
      },
      small_vendors: [1, 22, 21, 23, 28],
      medium_vendors: [2, 3],
      large_vendors: [6, 10, 13, 14, 17, 18, 19, 20, 25],
      tier_group : '',
      price_request_validity : true ,
      order_currency : '',
      new_cost : '',
      new_pricing_uuid : '',
      show_price_split : false ,
      payment_check : '',
      payment_methods: [],
      payment_method : '',
      addCardStatus: false,
      deletedCardIndex: '',
      activeSavedCard: '',
      vgs_valid_payment: false,
      saveCardState: false,
      country : '',
      form: {},
      message : '',
      loading_payment : false,
      payment_type : '',
      mpesa_poll_timer_id: null,
      payment_state: 0,
      mpesa_valid: false,
      mpesa_payment: false,
      mpesa_payment_state: false,
      sendyPhoneProps: {
       mode: 'international',
       defaultCountry: 'ke',
       preferredCountries: ['ke', 'ug', 'tz'],
      },
      vueTelInputProps: {
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('general.enter_phone_number'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        autocomplete: 'off',
        name: 'telephone',
        maxLen: 25,
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
      },
      editedNotes : '' ,
      editedContact : '',
      cancelMessage: '',
      rescheduleOptions: false,
      locationOptions: false,
      driverAllocatedOptions: false,
      send_sms : false,
      schedule_time: '',
      default_value: this.moment().format('HH:mm:ss'),
      dueDatePickerOptions: {
        disabledDate: this.disabledDueDate,
      },
      cancellation_step : false,
      price_request_object : {},
      transaction_id: null,
      poll_count: 0,
      poll_limit: 6,
      transactionText: 'loading ....',
      showAdditionalCardFields: false,
      additionalData: null,
      is3DS: false,
      twoFACompleted: false,
      transactionStatus: null,
      count: false
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
      getEditLocationDialog: '$_orders/$_tracking/getEditLocationDialog',
      getNotesInStore: '$_orders/$_tracking/getNotesInStore',
      getNotesDialog: '$_orders/$_tracking/getNotesDialog',
      getScheduleTimeDialog: '$_orders/$_tracking/getScheduleTimeDialog',
      getPickUpTime: '$_orders/$_tracking/getPickUpTime',
      getStoreOrderPath: '$_orders/$_tracking/getStorePath',
      get_pickup_filled: '$_orders/$_tracking/getPickUpFilled',
      get_extra_destinations: '$_orders/$_tracking/getExtraDestinations',
      get_max_destinations: '$_orders/$_tracking/getMaxDestinations',
      getCountryCode: 'getCountryCode',
      getRunningBalance: 'getRunningBalance',
      get_saved_cards: '$_orders/$_home/getSavedCards',
      getCardPaymentStatus: '$_payment/getCardPaymentStatus',
      getSession: 'getSession',
      getAmountDue: '$_orders/$_tracking/getAmountDue',
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
    getCancellationOrderStatus() {
      const logTypes = [];
      this.tracking_data.delivery_log.forEach(log => {
        logTypes.push(log.log_type);
      });
      if (this.tracking_data.confirm_status === 0 && this.tracking_data.delivery_status === 0) {
        return 1;
      } else if (this.tracking_data.confirm_status === 1 && this.tracking_data.delivery_status === 0 && logTypes[logTypes.length - 1] !== 10) {
        return 2;
      } else if (this.tracking_data.confirm_status === 1 && this.tracking_data.delivery_status === 0 && logTypes[logTypes.length - 1] === 10) {
        return 3;
      } else {
        return 4
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
    savedCardsTally() {
      return this.get_saved_cards.length;
    },
    valid_vgs_saved_card() {
      if (!this.addCardStatus && this.activeSavedCard !== '') {
        return true;
      }
      return false;
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
        const eventPayload = {
          eventCategory: 'Order Cancellation',
          eventAction: 'Click',
          eventLabel: 'No Button - Order Cancellation Page - WebApp',
        };
        this.fireGAEvent(eventPayload);
        this.cancellation_step = false;
      }
    },
    shareOption(val) {
      if (!val) {
        this.setShareOption(false);
      }
    },
    editLocationOption(val) {
      if (!val) {
        this.cancelMessage = '';
        this.locationOptions = false;
        this.setEditLocationDialog(false);
        //should also clear stored locations
      }
      else {
          this.refreshAccountBalance();
          setTimeout(() => {
            this.handleLocationPath();
          }, 800);

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
    cancel_reason(value) {
      if (value !== '') {
        this.cancelChange(value);
      }
    },
    getShareOption(value) {
      this.shareOption = value;
    },
    getEditLocationDialog(value) {
      this.editLocationOption = value;
    },
    getNotesDialog(value) {
      this.editInstructionsOption = value;
      this.storedNotes = this.getNotesInStore;
      this.send_sms = this.getNotesInStore.notify;
      this.editedNotes = this.getNotesInStore.notes === null ? '' : this.getNotesInStore.notes ;
      this.editedContact = this.getNotesInStore.recipient_phone === null ? '' : this.getNotesInStore.recipient_phone ;
    },
    getScheduleTimeDialog(value) {
      this.editScheduledTimeOption = value;
      this.default_value = this.moment(this.getPickUpTime).format('HH:mm:ss');
      this.sendGA4Events('select_reschedule_order');
    },
    editInstructionsOption(val) {
      if (!val) {
        this.showNotesDialog(false);
        this.updateNotesInStore({});
        this.storedNotes = {};
        this.send_sms = false ;
        this.editedNotes = '';
        this.editedContact = '';
      }
    },
    editScheduledTimeOption(val) {
      if (!val) {
        this.cancelMessage = '';
        this.rescheduleOptions = false;
        this.showScheduleTimeDialog(false);
        this.updatePickUpTimeInStore('');
      }
    },
    getSession: {
      handler() {
        if (Object.keys(this.$store.getters.getSession).length > 0) {
          this.confirmUser();
        }
      },
      deep: true,
    },
    addCardStatus(val) {
      if (val) {
        setTimeout(() => {
          this.setForm();
        }, 800);
      } else {
        this.getUserCards();
      }
    },
    payment_method(val) {
      if (val === 2 && this.get_saved_cards.length === 0) {
        setTimeout(() => {
          this.addCardStatus = true;
        }, 500);
      }
      if (val !== 2) {
        this.addCardStatus = false;
      }
      this.sendGA4Events('select_payment_option', {payment_option: this.payment_methods.filter(
        data => data.payment_method_id === val,
      )[0].name});
    },
    savedCardsTally(val) {
      if (val === 0) {
        setTimeout(() => {
          this.addCardStatus = true;
        }, 500);
      }
    },
    form: {
      handler(val) {
        if (
          Object.prototype.hasOwnProperty.call(val.state, 'cardno')
          && val.state.cardno.isValid
          && val.state.cvv.isValid
          && val.state.expirydate.isValid
          && this.addCardStatus
        ) {
          this.vgs_valid_payment = true;
        } else {
          this.vgs_valid_payment = false;
        }
      },
      deep: true,
    },
    send_sms(val) {
      if (val) {
        this.sendGA4Events('select_sms_notification');
      }
    },
  },
  mounted() {
    this.show_price_split = false ;
    this.loading = true;
    this.$store.commit('$_orders/$_tracking/setTrackedOrder', this.$route.params.order_no);
    this.poll(this.$route.params.order_no);
    this.initiateOrderData();
    this.loadVeryGoodSecurityScript();
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
      setEditLocationDialog: '$_orders/$_tracking/setEditLocationDialog',
      setPickupFilled: '$_orders/$_tracking/setPickUpFilled',
      setPickUpFilledStatus: '$_orders/$_tracking/setPickUpFilledStatus',
      unsetOrderPath: '$_orders/$_tracking/unsetOrderPath',
      setOrderPath: '$_orders/$_tracking/setOrderPath',
      clearStorePath: '$_orders/$_tracking/clearStorePath',
      unsetLocationName: '$_orders/$_tracking/unsetLocationName',
      set_location_name: '$_orders/$_tracking/setLocationName',
      addExtraDestination: '$_orders/$_tracking/addExtraDestination',
      removeExtraDestination: '$_orders/$_tracking/removeExtraDestination',
      setSavedCards: '$_orders/$_home/setSavedCards',
      setCardPaymentStatus: '$_payment/setCardPaymentStatus',
      setSecondaryProfile: 'setSecondaryProfile',
      showNotesDialog: '$_orders/$_tracking/showNotesDialog',
      updateNotesInStore: '$_orders/$_tracking/updateNotesInStore',
      showScheduleTimeDialog: '$_orders/$_tracking/showScheduleTimeDialog',
      updatePickUpTimeInStore: '$_orders/$_tracking/updatePickUpTimeInStore',
      setExtraDestination: '$_orders/$_tracking/setExtraDestination',
      setAmountDue: '$_orders/$_tracking/setAmountDue',
    }),
    ...mapActions({
      requestPriceQuote: '$_orders/$_home/requestPriceQuote',
      requestPaymentOptions: '$_orders/$_home/requestPaymentOptions',
      requestSavedCards: '$_orders/$_home/requestSavedCards',
      requestMpesaPaymentAction: '$_payment/requestMpesaPayment',
      completeMpesaPaymentRequest: '$_payment/completeMpesaPaymentRequest',
      requestCancellationReasons: '$_orders/$_tracking/requestCancellationReasons',
      computeCancellationFee: '$_orders/$_tracking/computeCancellationFee',
      paymentAxiosGet: '$_payment/paymentAxiosGet',
      paymentAxiosPost: '$_payment/paymentAxiosPost',
    }),
    dispatchScheduleTime(){
      this.default_value = this.moment(this.schedule_time).format('HH:mm:ss');
      this.sendGA4Events('add_time');
    },
    loadVeryGoodSecurityScript() {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://js.verygoodvault.com/vgs-collect/2.0/vgs-collect.js';
      document.head.appendChild(script);
    },

    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },

    setForm() {
      // eslint-disable-next-line no-undef
      this.form = VGSCollect.create(
        process.env.CONFIGS_ENV.VGS_VAULT_ID,
        process.env.CONFIGS_ENV.VGS_ENVIRONMENT,
        () => {},
      );

      this.form.field('#cc-number .fake-input-1', {
        type: 'card-number',
        name: 'cardno',
        successColor: '#4F8A10',
        errorColor: '#D8000C',
        fontSize: '11px',
        css: {
          'letter-spacing': '0.03em',
        },
        placeholder: this.$t('general.card_number'),
        validations: ['required', 'validCardNumber'],
      });

      this.form.field('#cc-cvc .fake-input-1', {
        type: 'card-security-code',
        name: 'cvv',
        fontSize: '11px',
        css: {
          'letter-spacing': '0.03em',
        },
        placeholder: this.$t('general.card_number'),
        validations: ['required', 'validCardSecurityCode'],
      });

      this.form.field('#cc-expiration-date .fake-input-1', {
        type: 'card-expiration-date',
        name: 'expirydate',
        fontSize: '11px',
        css: {
          'letter-spacing': '0.03em',
        },
        serializers: [{ name: 'replace', options: { old: ' ', new: '' } }],
        placeholder: this.$t('general.card_expiry'),
        validations: ['required', 'validCardExpirationDate'],
      });
    },
    // eslint-disable-next-line func-names
    debounceCancelReason: _.debounce(function (data) {
      this.fireGAEvent({
        eventCategory: 'Order Cancellation',
        eventAction: 'Click',
        eventLabel: 'Enter cancel reason input - Order Cancellation Page - WebApp',
      });
    }, 500),
    timeDifference(logType) {
      let timeDiff = '';
      const now = this.moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
      this.tracking_data.delivery_log.forEach(log => {
        if (log.log_type === logType) {
          timeDiff = (this.moment(this.convertToUTC(now).utc().format('YYYY-MM-DD HH:mm:ss')) - this.moment(log.log_time)) / (60 * 1000);
        }
      });
      return Math.round(timeDiff);
    },
    actionComparator(row, timeDiff) {
      if (row.comparator === 0 ||
        row.comparator === 1 && timeDiff < parseInt(row.duration, 10) ||
        row.comparator === 2 && timeDiff > parseInt(row.duration, 10)
      ) {
        return true;
      }
      return false;
    },
    cancelChange(reason) {
      this.more_info = false;
      this.calculateCancellationFee(reason);
      this.cancel_desc = '';
      this.cancelMessage = '';
      const data = this.cancellation_reasons.find(
        position => position.cancellation_reason_id === reason,
      );
      let timeDiff = 0;
      if (this.getCancellationOrderStatus === 1) {
        timeDiff = this.timeDifference(1);
      } else if (this.getCancellationOrderStatus === 2) {
        timeDiff = this.timeDifference(2);
      } else if (this.getCancellationOrderStatus === 3) {
        timeDiff = this.timeDifference(10);
      }
      if (data.actions) {
        data.actions.forEach(row => {
          if (row.action_type === 1) {
            this.showEditPickUpTime();
            this.cancelMessage = row.message;
            this.rescheduleOptions = true;
          } else if (row.action_type === 4) {
            this.showEditLocationsDialog();
            this.cancelMessage = row.message;
            this.locationOptions = true;
          } else if (row.action_type === 5 && this.actionComparator(row, timeDiff)) {
            this.cancelOption = false;
            this.driverAllocatedOptions = true;
            this.cancelMessage = row.message;
          }
        });
      }
      if (reason === 0) {
        this.more_info = true;
      } else {
        this.cancel_desc = data.cancellation_reason;
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
          this.refreshAccountBalance();
          const session = this.$store.getters.getSession;
          this.country = session[session.default].country_code;
        }
      }
    },
    checkAccountPaymentOption() {
      return (
        (this.tracking_data.payment_option === 1
          && this.getRunningBalance - this.getAmountDue >= 0)
        || this.tracking_data.payment_option === 2
        || (this.tracking_data.payment_option === 0
          && this.getRunningBalance - this.getAmountDue >= 0)
      );
    },
    handleLocationPath(){
      if (this.tracking_data !== undefined) {
        if (Object.keys(this.tracking_data).length > 0) {

           if (this.tracking_data.path.length > 1) {
             this.setExtraDestination(this.tracking_data.path.length - 2);
           }

          for (let i = 0; i < this.tracking_data.path.length; i++) {
            this.locations[i] = this.tracking_data.path[i].name ;
            const pathObj = {
              waypoint_id: this.tracking_data.path[i].waypoint_id,
              name: this.tracking_data.path[i].name,
              coordinates: this.tracking_data.path[i].coordinates,
              waypoint_details_status: true,
              type: 'coordinates',
              country_code: this.tracking_data.path[i].country_code,
              more: {
                Estate: '',
                FlatName: '',
                place_idcustom: this.tracking_data.path[i].more.place_idcustom,
                Label: '',
                HouseDoor: '',
                Otherdescription: '',
                Typed: '',
                Vicinity: 'Not Indicated',
                Address: 'Not Indicated',
              },
            };
            let index = i ;
            const pathPayload = {
              index,
              path: pathObj,
            };
            const locationNamePayload = {
              index,
              name: this.tracking_data.path[i].name,
            };
            this.resetPathLocation(index);
            this.setOrderPath(pathPayload);
            this.setLocationInModel(index, this.tracking_data.path[i].name);
            this.set_location_name(locationNamePayload);
            if (i === 0) {
              this.setPickupFilled(true);
              this.setPickUpFilledStatus(true);
            }
            this.attemptPriceRequest();
         }
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
                that.doNotification('2', this.$t('general.order_cancelled'), this.$t('general.your_order_cancelled'));
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
        const eventPayload = {
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
      if (cancelReason === true) {
        const eventPayload = {
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
      this.sendGA4Events('select_expand_information');
    },
    checkVendorName() {
      if (
        Object.keys(this.tracking_data).length > 0
        && Object.prototype.hasOwnProperty.call(this.tracking_data.rider, 'vendor_name')
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
        Object.keys(session).length > 0
        && Object.prototype.hasOwnProperty.call(session, 'default')
      ) {
        const sessionUserEmail = session[session.default].user_email;
        const orderUserEmail = this.tracking_data.user.email;

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
        order_no: this.tracking_data.order_no,
      };
      this.$store.dispatch('$_orders/$_tracking/computeCancellationFee', payload).then(
        (response) => {
          if (response.data.cancellation_fee === 0) {
            this.cancellation_fee = false;
            this.cancellation_amount = 0;
            this.cancellation_message = '';
          } else {
            this.cancellation_fee = false;
            this.cancellation_amount = response.data.cancellation_fee;
            this.cancellation_message = response.data.description;
          }
          this.cancelOption = true;
          this.cancel_reason = '';
        },
        () => {
          this.cancellation_fee = false;
          this.cancelOption = false;
          this.cancel_reason = '';
        },
      );
      this.sendGA4Events('select_cancel_order');
    },
    calculateCancellationFee(reason) {
      const payload = {
        order_no: this.tracking_data.order_no,
        cancellation_reason_id: reason,
      };
      this.$store.dispatch('$_orders/$_tracking/computeCancellationFee', payload).then(
        (response) => {
          if (response.data.cancellation_fee) {
            this.doNotification(2, this.$t('general.cancellation_fee'), this.$t('general.You_may_be_charged_a_cancellation_fee', {fee:`${response.data.currency} ${response.data.cancellation_fee}`}));
          }
        }
      );
    },
    getCancellationInfo(){
      let text = this.$t('general.incur_cancellation_fee_of') + this.tracking_data.currency + this.cancellation_amount + `, ${this.$t('general.ensure_order_details_ready')}`;
      if (this.getStatus === 'Confirmed') {
        text = `${this.$t('general.note_you_will_be_charged')} ${this.tracking_data.currency} ${this.cancellation_amount} ${this.$t('general.for_cancelling_order')}`;
      }

      return text;
    },
    place() {
      this.pop_state = false;
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
    cancelPromocode () {
      const session = this.$store.getters.getSession;

      const copID = session.default === 'biz' ? session[session.default].cop_id : 0;
      const individualID = session.default === 'biz' ? session[session.default].cop_id : session[session.default].user_id;

      const payload = {
          cop_id : copID,
          individual_id : individualID,
          coupon_code :"",
          coupon_amount :0,
          is_cancelled :true,
          coupon_type :0
      };

      this.$store.dispatch('$_orders/$_tracking/cancelCoupon', payload).then(
        (response) => {
          return response.status;
        },
        (error) => {
          return error;
        },
      );
    },
    cancelOrder() {
      if (this.cancel_reason !== '' && Object.keys(this.$store.getters.getSession).length > 0) {
        if (this.cancel_reason === 0 && this.cancel_desc === '') {
          this.doNotification(3, this.$t('general.order_cancellation_failed'), this.$t('general.provide_reason_for_cancellation'));
        } else {
          this.pop_state = this.cancel_reason;
          setTimeout(() => {
            this.pop_state = false;
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
          const eventPayload = {
            eventCategory: 'Order Cancellation',
            eventAction: 'Click',
            eventLabel: 'Yes Button - Order Cancellation Page - WebApp',
          };
          this.fireGAEvent(eventPayload);

          this.cancelPromocode();

          this.$store.dispatch('$_orders/$_tracking/cancelOrder', payload).then((response) => {
            if (response.status) {
              that.doNotification('1', this.$t('general.order_cancelled'), this.$t('general.order_cancelled_succesfully'));
              that.cancelToggle();
              this.showScheduleTimeDialog(false);
              this.setEditLocationDialog(false);
              this.$store.dispatch('$_orders/fetchOngoingOrders');
              that.place();
            } else {
              const payload2 = {
                order_no: that.$route.params.order_no,
                cancel_reason_id: 4,
                reason_description: 'I placed the wrong locations',
                client_type: that.$store.getters.getSession.default,
              };
              this.$store
                .dispatch('$_orders/$_tracking/cancelOrder', payload2)
                .then((response2) => {
                  if (response2.status) {
                    that.doNotification('1', this.$t('general.order_cancelled'), this.$t('general.order_cancelled_succesfully'));
                    that.cancelToggle();
                    this.showScheduleTimeDialog(false);
                    this.setEditLocationDialog(false);
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
        this.doNotification(3, this.$t('general.order_cancellation_failed'), this.$t('general.select_cancellation_reason'));
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
      const sessionData = this.$store.getters.getSession;
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
    initiateMQTT() {
      if (this.tracking_data.rider.vendor_id !== 26) {
        this.$store.dispatch('$_orders/$_tracking/trackMQTT');
      } else {
        this.hide_vendors();
        this.clearVendorMarkers();
      }
    },

    /* start card */

    getUserCards() {
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      let user_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
      } else {
        cop_id = 0;
        user_id = session.peer.user_id;
      }

      const cardPayload = {
        user_id,
        cop_id,
        entity_id: 3,
        country_code: session[session.default].country_code,
      };

      // encrypt card payload here

      const fullPayload = {
        values: cardPayload,
        app: 'PAYMENT_GATEWAY',
        endpoint: '/payment_methods',
      };

      this.requestSavedCards(fullPayload).then(
        (response) => {
          // decrypt response here
          if (response.status) {
            const cards = response.saved_payment_methods.filter(el => el.pay_method_id === 2)
            this.setSavedCards(cards);
          } else {
            this.setSavedCards([]);
          }
        },
        error => false,
      );
    },

    getCardValue(last4digits) {
      return `2_${last4digits}`;
    },

    formatCardNumber(cardno) {
      const last4 = cardno.substring(cardno.length - 4, cardno.length);
      return `**** **** **** ${last4}`;
    },

    deleteSavedCard(index) {
      const session = this.$store.getters.getSession;
      const accData = session[session.default];
      const payload = {
        cardno: this.get_saved_cards[index].pay_method_details,
        userid: accData.user_id,
      };
      const deleteCardPayload = {
        values: payload,
        app: 'PAYMENT_GATEWAY',
        endpoint: '/api/v1/card/delete',
      };
      this.deleteCardIndex = '';
      this.loading_payment = true;
      this.requestSavedCards(deleteCardPayload).then((response) => {
        this.loading_payment = false;
        if (response.status) {
          this.getUserCards();
        } else {
          const notification = {
            title: this.$t('general.failed_to_delete_saved_card'),
            level: 2,
            message: this.$t('general.try_again_later'),
          };
          this.displayNotification(notification);
        }
      });
    },

    handleContinue(val) {
      if (val) {
        this.loading_payment = true;
        this.pollCard();
        return;
      }
      this.loading_payment = false;
      this.showAdditionalCardFields = false;
      this.clearInputs();
      const notification = {
        title: this.$t('general.failed_to_charge_card'),
        level: 2,
        message: this.$t('general.failed_to_charge_card_text'),
      };
      this.displayNotification(notification);
    },

    init3DS(additionalData) {
      const res = additionalData[0];
      const url = res.field;
      const urlWindow = window.open(url, '');

      const timer = setInterval(() => {
			  if (urlWindow.closed) {
          this.init3dsPoll();
          clearInterval(timer);
        }
	  	}, 500);

    },

    init3dsPoll() {
      this.loading_payment = true;
      const payload = {
        transaction_id: this.transaction_id,
        tds: true,
      }

      const fullPayload = {
        values: payload,
        app: 'AUTH',
        endpoint: 'customers/submit_info'
      }

      this.paymentAxiosPost(fullPayload).then((res) => {
        if (res.status) {
          switch (res.transaction_status) {
              case 'pending':
                this.transactionPoll();
                this.count = true;
                break;
              case 'success':
                this.poll_count = this.poll_limit;
                this.clearInputs();
                this.loading_payment = false;
                const notification1 = {
                  title: res.transaction_status,
                  level: 1,
                  message: res.message,
                };
                this.displayNotification(notification1);
                break;
              default:
                break;
          };
          return;
        }
      }).catch((error) => {
        this.transactionText = this.$t('general.failed_to_charge_card');
        this.loading_payment = false;
        this.clearInputs();
        const notification = {
          title: this.$t('general.failed_to_charge_card'),
          level: 2,
          message: res.message,
        };
        this.displayNotification(notification);
      });
    },

    onSubmit() {
      if (this.vgs_valid_payment) {
        const session = this.$store.getters.getSession;
        const accData = session[session.default];
        const firstName = accData.user_name.split(' ')[0];
        const lastName = accData.user_name.split(' ').length > 1 ? accData.user_name.split(' ')[1] : '';
        const newCardPayload = {
          currency: this.order_currency,
          country: this.getCountryCode,
          amount: this.getAmountDue,
          amount: 1,
          email: accData.user_email,
          phonenumber: accData.user_phone,
          firstname: firstName,
          lastname: lastName,
          txref: `${Date.now()}`,
          userid: accData.user_id,
          copid: session.default === 'biz' ? accData.cop_id : 0,
          save: this.saveCardState,
          paymethod: 2,
          bulk: false,
        };
        
        this.loading_payment = true;
        this.transactionText = 'Initializing card payment...';
        this.form.submit(
          '/customers/collect_card_details',
          {
            data: newCardPayload,
            headers: {
              Authorization: localStorage.jwtToken,
            },
          },
          (status, response) => {
            if (response.status) {
              const newSavedCardPayload = {
                values: response.data,
                app: 'AUTH',
                endpoint: 'customers/charge_card_v3',
              };
              this.requestSavedCards(newSavedCardPayload).then((res) => {
                this.transaction_id = res.transaction_id;
                if (res.status) {
                  this.transactionStatus = res.transaction_status;

                  if(res.additional_data) {
                    this.additionalData = res.additional_data;
                    this.is3DS = res.tds;
                    if (res.tds) {
                      this.init3DS(res.additional_data);
                      return;
                    }
                    this.showAdditionalCardFields = true;
                    this.loading_payment = false;
                    return;
                  }

                  switch (res.transaction_status) {
                    case 'pending':
                      this.transactionPoll();
                      break;
                    case 'success':
                      this.transactionText = res.message;
                      this.loading_payment = false;
                      this.clearInputs();
                      const notification = {
                        title: res.transaction_status,
                        level: 1,
                        message: res.message,
                      };
                      this.displayNotification(notification);
                      break;
                    default:
                      break;
                  }

                } else {
                  this.loading_payment = false;
                  this.clearInputs();
                  this.doNotification(2, this.$t('general.failed_to_charge_card'), res.message);
                }
              }).catch(err => {
                  this.loading_payment = false;
                  this.clearInputs();
                  this.doNotification(2, this.$t('general.failed_to_charge_card'), this.$t('general.failed_to_charge_card_text'));
              });
            } else {
              this.loading_payment = false;
              this.clearInputs();
              this.doNotification(2, this.$t('general.failed_to_charge_card'), response.message);
            }
          },
        );
        
      } else {
        this.loading_payment = false;
        this.doNotification(
          2,
          this.$t('general.failed_to_charge_card'),
          this.$t('general.enter_card_details_try_again'),
        );
      }
    },

    chargeSavedCard() {
      if (this.valid_vgs_saved_card) {
        const session = this.$store.getters.getSession;
        const accData = session[session.default];
        const payload = {
          txref: `${Date.now()}`,
          cardno:
            this.activeSavedCard !== '' && this.get_saved_cards.length > 0
              ? this.get_saved_cards[this.activeSavedCard].pay_method_details
              : '',
          currency: order_currency,
          amount: this.getAmountDue,
          country: this.getCountryCode,
          phonenumber: accData.user_phone,
          userid: accData.user_id,
          copid: session.default === 'biz' ? accData.cop_id : 0,
          bulk: false,
        };

        const savedCardPayload = {
          values: payload,
          app: 'AUTH',
          endpoint: 'customers/charge_saved_card_v3',
        };

        this.loading_payment = true;
        this.requestSavedCards(savedCardPayload).then(
          (response) => {
            this.transaction_id = response.transaction_id;
            if (response.status) {
              if(response.additional_data) {
                this.additionalData = res.additional_data;
                this.is3DS = res.tds;
                if (response.tds) {
                  this.init3DS(response.additional_data);
                  return;
                }
                this.showAdditionalCardFields = true;
                this.loading_payment = false;
                return;
              }

              switch (response.transaction_status) {
                case 'pending':
                  this.transactionPoll();
                  break;
                case 'success':
                  this.transactionText = response.message;
                  this.loading_payment = false;
                  this.clearInputs();
                  const notification = {
                    title: response.transaction_status,
                    level: 1,
                    message: response.message,
                  };
                  this.displayNotification(notification);
                  break;
                default:
                  break;
              }

            } else {
              this.loading_payment = false;
              this.transactionText = response.reason;
              this.doNotification(2, this.$t('general.failed_to_charge_card'), response.message);
            }
          },
          error => false,
        );
      } else {
        this.loading = false;
        this.doNotification(2, this.$t('general.failed_to_charge_card'), this.$t('general.select_one_of_your_saved_cards'));
      }
    },

    transactionPoll() {
      this.poll_count = 0;
      for (let poll_count = 0; poll_count < this.poll_limit; poll_count++) {
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            if (that.poll_count === that.poll_limit) {
              poll_count = poll_limit;
              return;
            }

            that.updateTransactionStatus(); 
            if (poll_count === (that.poll_limit - 1)) {
              that.transactionText = 'card payment Failed';
              that.loading_payment = false;
              const notification = {
                title: that.$t('general.failed_to_charge_card'),
                level: 2,
              };
              that.clearInputs();
              that.displayNotification(notification);
              return;
            }
          }, 10000 * poll_count);
        }(poll_count));
      }
    },

    updateTransactionStatus() {
      const fullPayload = {
        app: 'AUTH',
        endpoint: `customers/transaction_status?id=${this.transaction_id}`,
      }
      this.paymentAxiosGet(fullPayload).then((res) => {
        let level = 1;
        if (res.status) { 
          this.transactionText = res.message;
          switch (res.transaction_status) {
            case 'success':
              this.poll_count = this.poll_limit;
              this.loading_payment = false;
              this.doCompleteOrder();
              const notification1 = {
                title: res.transaction_status,
                level: level,
                message: res.message,
              };
              this.displayNotification(notification1);
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loading_payment = false;
              level = 2;
              this.clearInput();
              const notification2 = {
                title: res.transaction_status,
                level: level,
                message: res.message,
              };
              this.displayNotification(notification2);
              break;
            case 'pending':
              break;
            default:
              break;
          }

          return res;
        }

        const notification = {
          title: this.$t('general.failed_to_charge_card'),
          level: 2,
          message: res.message
        };
        this.displayNotification(notification);
      })
        
    },


    clearInputs() {
      this.saveCardState = false;
      setTimeout(() => {
        this.form.reset();
      }, 500);
    },

    shareETASms() {
      if (this.recipientPhone !== '' && this.recipientPhone.length > 9) {
        const payload = {};
        const track = `${window.location.origin}/external/tracking/${this.$route.params.order_no}`;
        const session = this.$store.getters.getSession;
        const userName = session[session.default].user_name;
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
              const riderOnlineData = response.partnerArray[0];
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
          },
        );
      }
    },
    orderETA() {
      if (Object.keys(this.tracking_data).length > 0) {
        if (this.tracking_data.rider.vendor_id !== 26) {
          if (this.tracking_data.confirm_status === 0) {
            const confirmEta = this.tracking_data.eta_data.etc;
            const etaSplit = confirmEta !== undefined ? confirmEta.split('to') : 'Not Available';
            const start = etaSplit[0].replace(/\s+/g, '');
            const end = etaSplit[1].replace(/\s+/g, '');

            const startEta = moment(start, moment.ISO_8601).format('h:mm a');
            const endEta = moment(end, moment.ISO_8601).format('h:mm a');

            this.setConfirmEta(`${startEta} - ${endEta}`);
            this.setPickUpEta('');
            this.setDeliveryEta('');
          } else if (
            this.tracking_data.confirm_status === 1
            && this.tracking_data.delivery_status === 0
          ) {
            const pickUpEta = this.tracking_data.eta_data.etp;
            const confirmedEta = this.tracking_data.eta_data.confirmed;
            const etaSplit = pickUpEta !== undefined ? pickUpEta.split('to') : 'Not Available';
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
    retrieveCancellationReasons() {
      const riderInfo = this.tracking_data.rider;
      const countryCode = this.tracking_data.currency === 'USD' ? this.tracking_data.path[0].country_code : this.getSession[this.getSession.default].country_code;
      const params = {
        vendor_id: riderInfo.vendor_id,
        order_status: this.getCancellationOrderStatus ? this.getCancellationOrderStatus : 4,
        country_code: countryCode,
        status: 1,
      };
      this.requestCancellationReasons(params).then(
        (response) => {
          if (response.status) {
            this.cancellation_reasons = response.data;
            this.cancellation_state = true;
          } else {
            this.cancellation_state = false;
          }
        },
        (error) => {
          this.cancellation_state = false;
        },
      );
    },
    cancelBtnState() {
      return this.tracking_data.delivery_status < 2 && this.user_state && this.cancellation_state;
    },
    disablePop() {
      this.cancelToggle();
      this.pop_state = false;
    },
    interCountyInforBar() {
      let resp = false;
      if (this.tracking_data !== undefined && Object.keys(this.tracking_data).length > 0) {
        if (this.tracking_data.rider.vendor_id === 26) {
          resp = true;
        }
      }
      return resp;
    },
    removeExtraDestinationWrapper(index) {
      this.removeExtraDestination();
      this.clearLocation(index);
    },
    addExtraDestinationWrapper() {
      this.addExtraDestination();
      this.scrollToBottom();
    },
    scrollToBottom() {
      const container = this.$refs.scrollable_locations;
      container.scrollTop = container.scrollHeight;
    },
    checkChangeEvents(evt, index) {
      // console.log('index', index);
      // console.log('evt', evt);
      // TO DO research implementation of native input events
    },
    attemptPriceRequest() {
      if (
        Array.isArray(this.locations)
        && this.locations.length > 1
        && this.get_pickup_filled === true
      ) {
        this.doPriceRequest();
      }
    },
    getSessionItem(itemName) {
      const session = this.$store.getters.getSession;
      return session[session.default][itemName];
    },
    createPriceRequestObject() {
      const obj = { path: this.getStoreOrderPath };
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }
      const infor = {
        email: acc.user_email,
        client_mode: 'cop_id' in acc ? acc.cop_id : 0,
        cop_id: 'cop_id' in acc ? acc.cop_id : 0,
        name: acc.user_name,
        phone: acc.user_phone,
        date_time: moment.utc(),
        schedule_status: false,
        schedule_time: moment.utc(),
        vendor_type: 1,
        group_id: 1,
        client_type: 'corporate',
        rider_dist: 0,
        no_charge_status: false,
        is_re_request: false,
        rider_phone: '0709779779',
        insurance: '0',
        type: 'coordinates',
        promotion_status: false,
        destination_paid_status: false,
        is_edit: false,
        country_code: this.getSessionItem('country_code'),
        default_currency: this.getSessionItem('default_currency'),
        preffered_currency: this.getSessionItem('default_currency'),
      };
      if (this.$route.path === '/orders/dedicated/multi-destination') {
        infor.order_type_tag = 'dedicated_order';
      }
      const jsonDecodedPath = JSON.stringify(obj);
      infor.path = jsonDecodedPath;
      const finalObj = { values: infor };
      return finalObj;
    },
    doPriceRequest() {
      this.price_request_object = {};
      const payload = {
        values: this.createPriceRequestObject(),
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'orders/price_request',
      };
      this.location_loading = true;
      // const previousActiveVendor = this.get_active_vendor_name;
      // const definedLocations = this.locations;
      this.$store.dispatch('$_orders/$_tracking/requestPriceQuote', payload).then(
        (response) => {
          this.refreshAccountBalance();
          this.location_loading = false;
          this.show_price_split = false ;
          if (this.large_vendors.includes(this.tracking_data.rider.vendor_id)) {
            this.tier_group = 'large';
          }
          else if (this.medium_vendors.includes(this.tracking_data.rider.vendor_id)) {
            this.tier_group = 'medium';
          }else {
            this.tier_group = 'small';
          }
          let priceRequestObject = response.values.economy_price_tiers ;
          let checker = priceRequestObject.find(position => position.tier_group === this.tier_group);

          if (checker === 'undefined' || checker === undefined) {
             this.price_request_validity = false ;
             this.location_loading = false;
             this.show_price_split = false ;
             this.message = this.$t('general.sorry_could_not_update_location', { vendor_name: this.tracking_data.rider.vendor_name})
          }
          else {
            let checkTrackingVendorId = checker.price_tiers.find(position => position.vendor_id === this.tracking_data.rider.vendor_id);
            if (checkTrackingVendorId === 'undefined' || checkTrackingVendorId === undefined) {
              this.price_request_validity = false ;
              this.location_loading = false;
              this.show_price_split = false ;
              this.message = this.$t('general.sorry_could_not_update_location', { vendor_name: this.tracking_data.rider.vendor_name})
            }
            else {
              this.price_request_object = response.values;
              this.checkOrderValidityState(checkTrackingVendorId);
            }
          }
          const acc = this.$store.getters.getSession;
          const accDefault = acc[acc.default];
          this.mixpanelTrackPricingServiceRequest(response);
          if (Object.prototype.hasOwnProperty.call(acc, 'admin_details')) {
            this.trackMixpanelEvent('Make Price Request - Edit locations', {
              'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
              'Client Type': 'Web Platform',
              'Super User Id': acc.admin_details.admin_id,
              'Client Account': accDefault.user_email,
            });
          } else {
            this.trackMixpanelEvent('Make Price Request - Edit locations', {
              'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
              'Client Type': 'Web Platform',
            });
          }
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'crisis_notification')) {
            this.doNotification(
              3,
              error.response.data.reason,
              error.response.data.crisis_notification.msg,
            );
          } else {
            this.doNotification(
              3,
              this.$t('general.price_request_failed'),
              this.$t('general.price_request_failed_text'),
            );
          }

          this.location_loading = false;
        },
      );
    },
    mixpanelTrackPricingServiceRequest(data) {
      if (!Object.prototype.hasOwnProperty.call(data, 'order_no')) {
        this.trackMixpanelEvent('Make Price Request - Pricing Service', {
          'Cop ID': data.client_id,
        });
      }
    },
    checkOrderValidityState(trackingVendorId){

      let value = {
        order_no: this.$route.params.order_no,
        pricing_uuid: trackingVendorId.id,
        client_type: 'corporate',
      };

      const payload = {
        values: value,
        app: 'ORDERS_APP',
        endpoint: 'edit_order',
      };

      this.$store.dispatch('$_orders/$_tracking/requestEditOrder', payload).then(
        (response) => {
          if (response.status) {
            this.price_request_validity = true ;
            this.show_price_split = true ;
            this.order_currency = trackingVendorId.currency;
            this.new_cost = trackingVendorId.cost;
            this.new_pricing_uuid = trackingVendorId.id;
            this.setAmountDue(trackingVendorId.cost - this.tracking_data.amount)
            this.setDefaultPaymentOptions(trackingVendorId);
          }
          else {
            this.price_request_validity = false ;
            this.location_loading = false;
            this.show_price_split = false ;
            this.message = `${this.$t('general.edit_location_failure')}: ${response.reason}` ;
          }
        },
        (error) => {
          this.price_request_validity = false ;
          this.location_loading = false;
          this.show_price_split = false ;
          this.message = `${this.$t('general.edit_location_failure')} : ${error.response.data.reason}`;
        },
      );

    },
    setDefaultPaymentOptions(val){
      const accountType = 'Individual';
      const payload = {
        currency: val.currency,
        country_code: this.getCountryCode,
        account_type: accountType,
        entry_point: 'Customer App Price Request',
      };
      const fullPayload = {
        values: payload,
        vm: this,
        app: 'PAYMENT_SERVICE',
        endpoint: 'accounts/pay_methods',
      };

      this.$store.dispatch('$_orders/$_tracking/requestPaymentOptions', fullPayload).then(
        (response) => {
             this.determinePaymentOptions(response);
        },
        (error) => {
          console.log('error', error);
        },
      );
    },
    determinePaymentOptions(data) {

      this.payment_methods = [];

      const exist = data.payment_methods.find(available => available.payment_method_id === this.tracking_data.payment_method);


      if (exist === undefined || exist === null) {
        this.payment_methods = data.payment_methods;
      } else {
        if (this.tracking_data.payment_method === 5) {
          this.payment_methods.push(exist);
        }
        else {
          let payment = [];
          payment = data.payment_methods;

          const cashIndex = data.payment_methods.findIndex(
            index => index.payment_method_id === 5,
          );
          payment = data.payment_methods.splice(cashIndex, 1);

          this.payment_methods = data.payment_methods;
        }
      }

      this.payment_methods.forEach((row) => {
        if (row.payment_method_id === 2) {
          this.setCardPaymentStatus(true);
        }
      });
    },

    do_set_payment_option() {
      let status = '';
      if (this.payment_check === '') {
        status = 'payment';
      }
      this.payment_check = status;
    },
    clearLocation(index) {
      this.resetLocation(index);
      this.attemptPriceRequest();
    },
    resetLocation(index) {
      if (index === 0) {
        this.setPickupFilled(false);
        this.setPickUpFilledStatus(false);
      }

      this.unsetOrderPath(index);
      this.deleteLocationInModel(index);
      this.unsetLocationName(index);
    },
    deleteLocationInModel(index) {
      this.locations.splice(index, 1);
    },
    resetPathLocation(index) {
      if (index === 0) {
        this.setPickupFilled(false);
        this.setPickUpFilledStatus(false);
        this.unsetOrderPath(index);
      }
      this.deleteLocationInModel(index);
      this.unsetLocationName(index);
    },
    setLocationInModel(index, name) {
      this.locations.splice(index, 0, name);
    },
    setLocation(place, index) {
      if (!place) {
        return;
      }
      const countryIndex = place.address_components.findIndex(country_code => country_code.types.includes('country'));
      const pathObj = {
        waypoint_id: this.generateWaypointId(),
        name: place.name,
        coordinates: `${place.geometry.location.lat()},${place.geometry.location.lng()}`,
        waypoint_details_status: true,
        type: 'coordinates',
        country_code: place.address_components[countryIndex].short_name,
        more: {
          Estate: '',
          FlatName: '',
          place_idcustom: place.place_id,
          Label: '',
          HouseDoor: '',
          Otherdescription: '',
          Typed: '',
          Vicinity: 'Not Indicated',
          Address: 'Not Indicated',
        },
      };
      const pathPayload = {
        index,
        path: pathObj,
      };
      const locationNamePayload = {
        index,
        name: place.name,
      };
      this.resetPathLocation(index);
      this.setOrderPath(pathPayload);
      this.setLocationInModel(index, `${place.name} (${place.formatted_address})`);
      this.set_location_name(locationNamePayload);
      if (index === 0) {
        this.setPickupFilled(true);
        this.setPickUpFilledStatus(true);
        const eventPayload = {
          eventCategory: 'Order Placement',
          eventAction: 'Click',
          eventLabel: 'Pickup Location - Order Placement - Web App',
        };
        if (this.$route.path === '/orders/dedicated/multi-destination') {
          this.trackLocationSelect(place.name, index);
        } else {
          this.trackMixpanelEvent(`Add Pickup Location ${eventPayload.eventLabel}`);
          this.fireGAEvent(eventPayload);
        }
      } else {
        const eventPayload = {
          eventCategory: 'Order Placement',
          eventAction: 'Click',
          eventLabel: 'Destination Location - Order Placement - Web App',
        };
        if (this.$route.path === '/orders/dedicated/multi-destination') {
          this.trackLocationSelect(place.name, index);
        } else {
          this.trackMixpanelEvent(`Add Destination ${eventPayload.eventLabel}`);
          this.fireGAEvent(eventPayload);
        }
      }
      if (index === 1) {
        this.sendGA4Events('edit_destination', {new_destination: place.name});
      } else if (index > 1) {
        this.sendGA4Events('add_destination');
      }
      this.attemptPriceRequest();
    },
    updateLocations(){
      this.loading_payment = true;
      if (this.tracking_data.payment_option === 2) {
        this.payment_type = 'postpay';
        this.payment_method = '';
      } else {
        this.payment_type = 'prepay';
      }
      this.sendGA4Events('select_update_location');
      this.checkPaymentDetails();
    },
    handlePostPaidPayments() {
      this.payment_type = 'postpay';
      this.doCompleteOrder();
    },
    doCompleteOrder(){

      let value = {
        order_no: this.$route.params.order_no,
        pricing_uuid: this.new_pricing_uuid,
        client_type: 'corporate',
        update : true
      };

      if (this.paymentStatusOption && this.show_payment && this.getOrderPaymentMethod === 1) {
        value.payment_method = parseInt(this.payment_method , 10);
      }

      const payload = {
        values: value,
        app: 'ORDERS_APP',
        endpoint: 'edit_order',
      };

      this.$store.dispatch('$_orders/$_tracking/requestEditOrder', payload).then(
        (response) => {
          this.loading_payment = false;
          if (response.status) {
            this.editLocationOption = false ;
            this.show_price_split = false ;
            this.poll(this.$route.params.order_no);
            this.doNotification(
              1,
              this.$t('general.location_updated_successfully'),
              '',
            );
          }
          else {
            this.doNotification(
              2,
              this.$t('general.locations_update_failed'),
              this.$t('general.please_try_again'),
            );
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('general.locations_update_failed'),
            this.$t('general.something_went_wrong_please_try'),
          );
          this.loading_payment = false;
        },
      );

    },
    checkPaymentDetails() {

      if (this.payment_method === '') {
        if (this.checkAccountPaymentOption()) {
          this.handlePostPaidPayments();
        } else {
          this.doNotification(
            '2',
            this.$t('general.choose_payment_method'),
           this.$t('general.select_payment_method_and_try_again'),
          );
          this.loading_payment = false;
          return false;
        }
      } else {
        if (Number(this.payment_method) === 1) {
          this.handleMpesaPayments();
        } else if (Number(this.payment_method) === 5) {
          this.handleCashPayments();
        } else if (Number(this.payment_method) === 3) {
          this.handlePromoCodePayments();
        } else if (Number(this.payment_method) === 11) {
          this.handleRunningBalancePayments();
        }
        else if (Number(this.payment_method) === 12) {
         this.handlePostPaidPayments();
       }
        else if (Number(this.payment_method) === 2) {
          if (this.addCardStatus) {
            this.onSubmit();
          } else {
            this.chargeSavedCard();
          }
        } else {
          // console.log('not handled payment method', this.payment_method);
        }
      }

      return true;
    },
    handleCashPayments() {
      this.doCompleteOrder();
    },
    handlePromoCodePayments() {
      this.$router.push({
        name: 'promo_payment',
      });
    },
    handleRunningBalancePayments() {
      this.doCompleteOrder();
    },
    payment_is_to_be_requested() {
      return this.getRunningBalance - this.getAmountDue < 0;
    },
    handleMpesaPayments() {
      if (this.payment_is_to_be_requested) {
        this.requestMpesaPayment();
        return false;
      }

      this.doCompleteOrder();
      return true;
    },

    /* start mpesa */

    requestMpesaPayment() {
      const session = this.$store.getters.getSession;
      let referenceNumber = 'SENDY';
      let copId = 0;
      let userId = 0;
      let userEmail = '';
      let userPhone = '';
      if (session.default === 'biz') {
        referenceNumber += session.biz.cop_id;
        copId = session.biz.cop_id;
        userId = session.biz.user_id;
        userEmail = session.biz.user_email;
        userPhone = session.biz.user_phone;
      } else {
        referenceNumber = session.peer.user_phone;
        userId = session.peer.user_id;
        userPhone = session.peer.user_phone;
        userEmail = session.peer.user_email;
      }

      const mpesaPayload = {
        amount: this.getAmountDue,
        sourceMobile: userPhone,
        referenceNumber,
        user_id: userId,
        cop_id: copId,
        phone: userPhone,
        email: userEmail,
        currency: this.order_currency,
        vendorType: this.tracking_data.rider.vendor_id,
      };
      const fullPayload = {
        values: mpesaPayload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'initiate_mpesa',
      };
      this.payment_state = 1;
      this.loading_payment = true;

      this.requestMpesaPaymentAction(fullPayload).then(
        (response) => {
          if (response.length > 0) {
            // eslint-disable-next-line no-param-reassign
            response = response[0];
          }

          if (response.status === 200 && response.data.status) {
            this.doNotification('0', this.$t('general.mpesa_payment'),this.$t('general.request_for_payment_sent', {userPhone: userPhone}));
            this.requestMpesaPaymentPoll();
          } else {
            this.refreshAccountBalance();
            this.doNotification(
              '0',
              this.$t('general.mpesa_payment'),
              this.$t('general.mpesa_request_failed', {userPhone: userPhone, referenceNumber: referenceNumber }) + this.pending_amount,
              // `M-Pesa request to ${userPhone} failed. Use paybill 848450 account number ${referenceNumber} amount KES ${
              //   this.pending_amount
              // }.`,
            );
            this.payment_state = 0;
            this.loading_payment = false;
          }
        },
        () => {
          this.refreshAccountBalance();
          this.doNotification(
            '0',
            this.$t('general.mpesa_payment'),
            this.$t('general.mpesa_request_failed', {userPhone: userPhone, referenceNumber: referenceNumber }) + this.getAmountDue,
            // `M-Pesa request to ${userPhone} failed. Use paybill 848450 account number ${referenceNumber} amount KES ${
            //    this.getAmountDue
            // }.`,
          );
          this.payment_state = 0;
          this.loading_payment = false;
        },
      );
    },

    clearMpesaPollCounter() {
      // fails silently if the id is not found
      window.clearTimeout(this.mpesa_poll_timer_id);
    },

    requestMpesaPaymentPoll(pollLimitValue = 6) {
      this.clearMpesaPollCounter();
      const session = this.$store.getters.getSession;
      let copId = 0;
      if (session.default === 'biz') {
        copId = session.biz.cop_id;
      }
      const profile_id = session.default === 'biz'
        ? session[session.default].cop_id
        : session[session.default].user_id;
      const profile_name = session.default === 'biz' ? 'cop_id' : 'user_id';
      const secondaryProfile = session.default === 'biz'
        ? this.price_request_object.client_id - profile_id === 100000000
        : this.price_request_object.user_id - profile_id === 100000000;
      const oldRb = this.$store.getters.getRunningBalance;
      const runningBalancePayload = {
        [profile_name]: profile_id,
        phone: session[session.default].user_phone,
        default_currency: session[session.default].default_currency,
        rb_currency: session[session.default].default_currency,
        secondary_profile: secondaryProfile,
      };

      const payload = {
        params: runningBalancePayload,
        app: 'NODE_PRIVATE_API',
        endpoint: 'running_balance',
      };

      const pollLimit = pollLimitValue; // 10secs * 6  = 60sec = 1min
      // poll the dispatch
      for (let pollCount = 0; pollCount < pollLimit; pollCount++) {
        // wait 10 seconds
        const that = this;
        // eslint-disable-next-line func-names,no-shadow
        (function (pollCount) {
          // eslint-disable-next-line consistent-return
          that.mpesa_poll_timer_id = window.setTimeout(() => {
            if (!that.mpesa_payment_state) {
              that.checkRunningBalance(oldRb, payload);
            }
            if (that.mpesa_payment) {
              // eslint-disable-next-line no-param-reassign
              pollCount = pollLimit;
              that.payment_state = 0;
              that.loading_payment = false;
              that.doNotification('1', that.$t('general.payment_successful'), that.$t('general.completing_your_order'));
              that.doCompleteOrder();
              that.mpesa_payment = false;
              that.mpesa_payment_state = true;
              return true;
            }

            if (pollLimitValue === 6) {
              if (pollCount === 5 && !that.mpesa_payment_state) {
                that.doNotification(
                  '0',
                  that.$t('general.payment_not_recieved'),
                  that.$t('general.will_keep_trying_checking_payment'),
                );
                that.payment_state = 0;
                that.loading_payment = false;
                that.requestMpesaPaymentPoll(60);
                that.mpesa_payment_state = false;
                that.mpesa_payment = false;
              }
            }
          }, 10000 * pollCount);
        }(pollCount));
      }
    },

    checkRunningBalance(oldRb, payload) {
      this.requestRunningBalanceFromAPI(payload).then(
        (response) => {
          if (response.length > 0) {
            // eslint-disable-next-line no-param-reassign,prefer-destructuring
            response = response[0];
          }
          if (!this.mpesa_payment_state) {
            if (response.status === 200) {
              const newRb = response.data.data.running_balance;
              if (newRb > oldRb) {
                this.completeMpesaPaymentRequest({});
                this.mpesa_payment = true;
              } else {
                this.mpesa_payment = false;
              }
            } else {
              this.mpesa_payment = false;
            }
          } else {
            this.requestMpesaPaymentPoll(60);
          }
        },
        // eslint-disable-next-line no-unused-vars
        error => false,
      );
    },

    cancelMpesaPaymentRequest() {
      this.payment_state = 0;
      this.loading_payment = false;
      this.doNotification(
        '2',
        this.$t('general.mpesa_payment_cancelled'),
        this.$t('general.mpesa_payment_cancelled_text'),
      );
      this.requestMpesaPaymentPoll(60);
    },
    validate_phone() {
      this.$validator.validate();
      this.sendGA4Events('add_phone_number');
    },
    editInstructionsOuterLabel() {
      let name = this.$t('general.add_drop_off_instructions');

      if (this.storedNotes.waypoint_type === 'PICKUP') {
        name = this.$t('general.add_pickup_instructions');
      }

      return name;
    },
    saveUpdatedInstructions(){
      let phoneValid = true ;
      if (this.editedContact !== '') {
        phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.editedContact));
      }

      if (phoneValid) {
        if (this.editedContact === '' && this.send_sms) {
          this.doNotification(
             2,
             this.$t('general.edit_instructions_error'),
             this.$t('general.kindly_provide_valid_phone_number_notify_recipient')
          );
        }
        else {
          this.initiateSaveInstructionsRequest();
        }
      }
      else {
        this.doNotification(
           2,
          this.$t('general.edit_instructions_error'),
          this.$t('general.provide_valid_phone_no'),
        );
      }
      this.sendGA4Events('select_update_instruction');
    },
    initiateSaveInstructionsRequest(){

      let newData = [
        {
           waypoint_id : this.storedNotes.waypoint_id,
           coordinates : this.storedNotes.coordinates,
           name : this.storedNotes.name,
           notes : this.editedNotes === '' ? null : this.editedNotes ,
           recipient_phone : this.editedContact === '' ? null : this.editedContact ,
           notify : this.send_sms,

        }
      ];
      for (let i = 0; i < this.tracking_data.path.length; i++) {
        if (this.tracking_data.path[i].name !== this.storedNotes.name) {
          newData.push({
            waypoint_id : this.tracking_data.path[i].waypoint_id,
            coordinates : this.tracking_data.path[i].coordinates,
            name: this.tracking_data.path[i].name,
            notes : this.tracking_data.path[i].notes === '' ? null : this.tracking_data.path[i].notes,
            recipient_phone : this.tracking_data.path[i].recipient_phone === "" ? null : this.tracking_data.path[i].recipient_phone,
            notify : this.tracking_data.path[i].notify,
          })
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
              this.$t('general.additional_instructions_updated_successfully'),
              '',
            );
          }
          else {
            this.doNotification(
              2,
              this.$t('general.additonal_instructions_update_failed'),
              this.$t('general.please_try_again'),
            );
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('general.additonal_instructions_update_failed'),
            this.$t('general.something_went_wrong_please_try_again'),
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

              this.doNotification(
                1,
                this.$t('general.pickup_time_updated'),
                '',
              );
            }
            else {
              this.doNotification(
                2,
                this.$t('general.pickup_time_update_failed'),
                this.$t('general.please_try_again'),
              );
            }
          },
          (error) => {
            if (Object.prototype.hasOwnProperty.call(error.response.data, 'reason')) {
              this.doNotification(2, this.$t('general.pickup_time_update_failed'), error.response.data.reason);
            }
            else {
              this.doNotification(
                2,
                this.$t('general.pickup_time_update_failed'),
                this.$t('general.something_went_wrong_please_try_again'),
              );
            }
          },
        );
      }
      else {
        this.doNotification(
          2,
          this.$t('general.edit_pickup_time'),
          this.$t('general.kindly_provide_pickup_time'),
        );
      }
      this.sendGA4Events('select_schedule_order');
    },
    cancelStep(val){
      this.cancellation_step = val ;
      if (!val) {
        this.cancelOption = val;
      }
    },
    showEditPickUpTime() {
      this.cancelOption = false;
      this.setTrackMoreInfo(true);
      this.showScheduleTimeDialog(true);
      this.updatePickUpTimeInStore(this.tracking_data.date_time);
    },
    showEditLocationsDialog() {
      this.cancelOption = false;
      this.setTrackMoreInfo(true);
      this.setEditLocationDialog(true);
      this.sendGA4Events('select_edit_location');
    },
    showFCWidget() {
      this.cancelOption = false;
      window.fcWidget.open();
    },
    checkScheduleOption() {
      let show = false;
      if (this.tracking_data.delivery_status < 2 && this.user_state) {
        show = true;
      }
      return show;
    },
    checkEditOption() {
      let show = false;
      if (
        Object.prototype.hasOwnProperty.call(this.tracking_data, 'edit_config')
        && this.user_state
      ) {
        if (this.tracking_data.edit_config !== null) {
          show = this.tracking_data.edit_config.add_drop_off;
        }
      }
      return show;
    },
    refreshAccountBalance() {
      return new Promise((resolve, reject) => {
        const session = this.$store.getters.getSession;
        const profile_id = session.default === 'biz'
          ? session[session.default].cop_id
          : session[session.default].user_id;
        const profile_name = session.default === 'biz' ? 'cop_id' : 'user_id';
        const secondaryProfile = session.default === 'biz'
          ? this.price_request_object.client_id - profile_id === 100000000
          : this.price_request_object.user_id - profile_id === 100000000;
        const runningBalancePayload = {
          [profile_name]: profile_id,
          phone: session[session.default].user_phone,
          default_currency: session[session.default].default_currency,
          rb_currency: session[session.default].default_currency,
          secondary_profile: secondaryProfile,
        };

        const payload = {
          values: runningBalancePayload,
          app: 'NODE_PRIVATE_API',
          endpoint: 'running_balance',
        };
        this.requestRunningBalanceFromAPI(payload).then(
          (response) => {
            if (response.length > 0) {
              // eslint-disable-next-line no-param-reassign,prefer-destructuring
              response = response[0];
            }
            if (response.status === 200) {
              const resp = response.data;
              this.$store.commit('setRunningBalance', resp.data.running_balance);
              resolve(response.data);
            } else {
              reject(response.data);
            }
          },
          (error) => {
            reject(error);
          },
        );
      });
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../assets/styles/info_window_component.css";
@import "../../../../../assets/styles/orders_order_placement.css";
@import '../../../../../assets/styles/orders_order_placement_options.css';
@import '../../../../../assets/styles/orders_order_placement_vendors.css';
</style>
<style scoped>
/* unfortunately browser vendors dont care about BEM */
::-webkit-scrollbar {
  width: 12px;
}
/* Track */
::-webkit-scrollbar-track {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}
/* Handle */
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: #1782c5;
}
::-webkit-scrollbar-thumb:window-inactive {
  background-color: rgba(0, 0, 0, 0.2);
}
.schedule_time_outer{
  margin-top: 11% !important;
}
.schedule_time_outer-mod {
  margin: 11% 5% 11% 5% !important;
}
.schedule_time_message {
  color: black;
  margin: 5% !important;
}
.edit-information-outer{
  margin: 5% 3% 5% 7%;
}
.cancellation-edit-options{
  color: #2C2A2A;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 2%;
  display: flex;
  align-items: center;
}
.edit-location-icon{
  color: #0c0c0c !important;
  font-size: 15px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.cancellation-edit-inner{
  margin: 2% 0px 5% 0px;
  color: #1B7FC3;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
}
.cancel-option-or-alt {
  text-align: center;
  color: black;
  text-transform: lowercase;
}
.cancel-option-confirm-alt {
  width: fit-content;
  margin: auto;
  cursor: pointer;
  color: #1682c5;
}
.schedule-disabled-btn {
  color: white;
  background: #7F7F7F;
}
.disabled-location-input {
  border: 1px solid #CFCFCF;
  background: #EDEDED;
}
.location-divider {
  width: 0px;
  height: 50px;
  border-left: 1px solid #cfcfcf;
  position: absolute;
  margin-top: -8%;
  margin-left: -10px;
}
.cancelOptions--info-icon {
  text-align: center;
  width: 100%;
  font-size: 30px;
  color: #1B7FC3;
}
.cancelOptions--info-message {
  width: 70%;
  text-align: center;
  font-size: 17px;
  margin: auto;
  padding-top: 20px;
  color: black;
}
</style>
