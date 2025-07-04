<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div class="space-y-1.5">
          <CardTitle>Proposals</CardTitle>
          <CardDescription>
            A list of proposals fetched from the Directus API. Select one using
            the radio buttons.
          </CardDescription>
        </div>

        <TooltipProvider :delay-duration="100">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                :disabled="isLoading"
                @click="fetchProposals"
              >
                <RefreshCcw class="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh Data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </CardHeader>
    <CardContent>
      <RadioGroup v-model="selectedProposalId">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[50px]"></TableHead>
              <TableHead class="w-[15%]">ID</TableHead>
              <TableHead class="w-[35%]">Short Title</TableHead>
              <TableHead class="w-[50%]">Long Title</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="isLoading">
              <TableRow v-for="n in 3" :key="n">
                <TableCell><Skeleton class="h-4 w-4 rounded-full" /></TableCell>
                <TableCell><Skeleton class="h-6 w-full" /></TableCell>
                <TableCell><Skeleton class="h-6 w-full" /></TableCell>
                <TableCell><Skeleton class="h-6 w-full" /></TableCell>
              </TableRow>
            </template>

            <template v-else-if="proposals.length > 0">
              <TableRow
                v-for="proposal in proposals"
                :key="proposal.id"
                :data-state="selectedProposalId === proposal.id && 'selected'"
              >
                <TableCell>
                  <RadioGroupItem
                    :id="`r-${proposal.id}`"
                    :value="proposal.id"
                  />
                </TableCell>
                <TableCell class="font-medium">{{ proposal.id }}</TableCell>
                <TableCell>{{ proposal.short_title }}</TableCell>
                <TableCell>{{ proposal.long_title }}</TableCell>
              </TableRow>
            </template>

            <template v-else>
              <TableRow>
                <TableCell :colspan="4" class="h-24 text-center">
                  No proposals found.
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </RadioGroup>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

// Import UI components
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-vue-next";

// --- TYPES ---
interface Proposal {
  id: string | number;
  long_title: string;
  short_title: string;
  original_title: string;
}

// --- STATE ---
const selectedProposalId = ref<string | number | null>(null);
const proposals = ref<Proposal[]>([]);
const isLoading = ref(false);

// --- COMPUTED PROPERTY FOR SELECTED PROPOSAL ---
const selectedProposal = computed(() => {
  if (!selectedProposalId.value) return undefined;
  return proposals.value.find((p) => p.id === selectedProposalId.value);
});

// --- DATA FETCHING ---
const { $directus, $readItems } = useNuxtApp();

async function fetchProposals() {
  isLoading.value = true;
  try {
    // FIX: The options object should be passed as the second argument
    // to the $readItems function, not chained after it.
    const response = await $directus.request(
      $readItems("proposals", {
        fields: ["id", "long_title", "short_title", "original_title"],
      }),
    );

    // The check for the response itself is sufficient.
    // The Directus SDK returns the data directly.
    if (response) {
      proposals.value = response as Proposal[];
    }
  } catch (error) {
    console.error("An error occurred while fetching proposals:", error);
    proposals.value = [];
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchProposals();
});

// --- EXPOSE TO PARENT ---
defineExpose({
  selectedProposal,
});
</script>
