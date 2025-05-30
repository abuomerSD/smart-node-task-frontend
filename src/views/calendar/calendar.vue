<script>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import listPlugin from "@fullcalendar/list";

import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import Swal from "vue-sweetalert2";

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

import { calendarEvents, categories } from "./data-calendar";

/**
 * Calendar component
 */
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  components: {
    FullCalendar,
    Layout,
    PageHeader,
  },
  data() {
    return {
      calendarEvents: calendarEvents,
      calendarOptions: {
        headerToolbar: {
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        },
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          bootstrapPlugin,
          listPlugin,
        ],
        initialView: "dayGridMonth",
        themeSystem: "bootstrap",
        initialEvents: calendarEvents,
        editable: true,
        droppable: true,
        eventResizableFromStart: true,
        dateClick: this.dateClicked,
        eventClick: this.editEvent,
        eventsSet: this.handleEvents,
        weekends: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
      },
      currentEvents: [],
      showModal: false,
      eventModal: false,
      categories: categories,
      submitted: false,
      submit: false,
      newEventData: {},
      edit: {},
      deleteId: {},
      event: {
        title: "",
        category: "",
      },
      editevent: {
        editTitle: "",
        editcategory: "",
      },
    };
  },
  validations: {
    event: {
      title: {
        required: helpers.withMessage("Title is required", required),
      },
      category: {
        required: helpers.withMessage("Category is required", required),
      },
    },
  },
  methods: {
    /**
     * Modal form submit
     */
    // eslint-disable-next-line no-unused-vars
    handleSubmit(e) {
      this.submitted = true;

      // stop here if form is invalid
      this.v$.$touch();
      if (this.v$.$invalid) {
        return;
      } else {
        const title = this.event.title;
        const category = this.event.category;
        let calendarApi = this.newEventData.view.calendar;

        this.currentEvents = calendarApi.addEvent({
          id: this.newEventData.length + 1,
          title,
          start: this.newEventData.date,
          end: this.newEventData.date,
          classNames: [category, 'text-white'],
        });
        this.successmsg();
        this.showModal = false;
        this.newEventData = {};
      }
      this.submitted = false;
      this.event = {};
    },
    // eslint-disable-next-line no-unused-vars
    hideModal(e) {
      this.submitted = false;
      this.showModal = false;
      this.event = {};
    },
    /**
     * Edit event modal submit
     */
    // eslint-disable-next-line no-unused-vars
    editSubmit(e) {
      this.submit = true;
      const editTitle = this.editevent.editTitle;
      const editcategory = this.editevent.editcategory + ' text-white';

      this.edit.setProp("title", editTitle);
      this.edit.setProp("classNames", editcategory);
      this.successmsg();
      this.eventModal = false;
    },

    /**
     * Delete event
     */
    deleteEvent() {
      this.edit.remove();
      this.eventModal = false;
    },
    /**
     * Modal open for add event
     */
    dateClicked(info) {
      this.newEventData = info;
      this.showModal = true;
    },
    /**
     * Modal open for edit event
     */
    editEvent(info) {
      this.edit = info.event;
      this.editevent.editTitle = this.edit.title;
      this.editevent.editcategory = this.edit.classNames[0];
      this.eventModal = true;
    },

    closeModal() {
      this.eventModal = false;
    },

    confirm() {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to delete this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.deleteEvent();
          Swal.fire("Deleted!", "Event has been deleted.", "success");
        }
      });
    },

    /**
     * Show list of events
     */
    handleEvents(events) {
      this.currentEvents = events;
    },

    /**
     * Show successfull Save Dialog
     */
    successmsg() {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Event has been saved",
        showConfirmButton: false,
        timer: 1000,
      });
    },
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Calendar" pageTitle="Skote" />

    <BRow>
      <BCol cols="12">
        <BCard no-body>
          <BCardBody>
            <div class="app-calendar">
              <FullCalendar ref="fullCalendar" :options="calendarOptions"></FullCalendar>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
    <BModal v-model="showModal" title="Add New Event" title-class="text-black font-18" body-class="p-3" hide-footer>
      <BForm @submit.prevent="handleSubmit">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="name">Event Name</label>
              <input id="name" v-model="event.title" type="text" class="form-control" placeholder="Insert Event name"
                :class="{ 'is-invalid': submitted && v$.event.title.$error }" />
              <div v-if="submitted && v$.event.title.$error" class="invalid-feedback">
                <span v-if="v$.event.title.required.$message">{{
                  v$.event.title.required.$message
                }}</span>
              </div>
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label class="control-label">Category</label>
              <select v-model="event.category" class="form-control" name="category"
                :class="{ 'is-invalid': submitted && v$.event.category.errors }">
                <option v-for="option in categories" :key="option.backgroundColor" :value="`${option.value}`">
                  {{ option.name }}
                </option>
              </select>

              <div v-if="submitted && v$.event.category.$error" class="invalid-feedback">
                <span v-if="v$.event.category.required.$message">{{
                  v$.event.category.required.$message
                }}</span>
              </div>
            </div>
          </BCol>
        </BRow>

        <div class="text-end pt-5 mt-3">
          <BButton variant="light" @click="hideModal">Close</BButton>
          <BButton type="submit" variant="success" class="ms-1">Create event</BButton>
        </div>
      </BForm>
    </BModal>

    <!-- Edit Modal -->
    <BModal v-model="eventModal" title="Edit Event" title-class="text-black font-18" hide-footer body-class="p-3">
      <div>Edit Event</div>
      <BForm @submit.prevent="editSubmit">
        <BRow>
          <BCol cols="12">
            <div class="mb-3">
              <label for="name">Event Name</label>
              <input id="name" v-model="editevent.editTitle" type="text" class="form-control"
                placeholder="Insert Event name" />
            </div>
          </BCol>
          <BCol cols="12">
            <div class="mb-3">
              <label class="control-label">Category</label>
              <select v-model="editevent.editcategory" class="form-control" name="category">
                <option v-for="option in categories" :key="option.backgroundColor" :value="`${option.value}`">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </BCol>
        </BRow>
        <div class="text-end p-3">
          <BButton variant="light" @click="closeModal">Close</BButton>
          <BButton class="ms-1" variant="danger" @click="confirm">Delete</BButton>
          <BButton class="ms-1" variant="success" @click="editSubmit">Save</BButton>
        </div>
      </BForm>
    </BModal>
  </Layout>
</template>
