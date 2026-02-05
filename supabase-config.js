// ============================================
// LUCID - Configuration Supabase
// ============================================

// IMPORTANT: Remplacez ces valeurs par vos vraies clés Supabase
const SUPABASE_URL = 'https://htvloyrumfsvamtthkzv.supabase.co';  // Ex: https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0dmxveXJ1bWZzdmFtdHRoa3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDg5OTIsImV4cCI6MjA4NTgyNDk5Mn0.Dlzba_l0KppyvvpRDB6Hxd1-oXk6J-aOHkpcs6TEdGc';  // Clé publique (anon/public)

// Attendre que la bibliothèque Supabase soit chargée
let supabaseClient;

function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialisé');
        return true;
    } else {
        console.error('❌ Bibliothèque Supabase non chargée');
        return false;
    }
}

// ============================================
// Fonctions pour enregistrer les leads
// ============================================

/**
 * Enregistre une demande de démo dans Supabase
 * @param {Object} formData - Données du formulaire
 * @returns {Promise<Object>} - Résultat de l'insertion
 */
async function saveDemoRequest(formData) {
    if (!supabaseClient) {
        if (!initSupabase()) {
            return { success: false, error: 'Supabase non initialisé' };
        }
    }

    try {
        const { data, error } = await supabaseClient
            .from('demo_requests')
            .insert([
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    employees: formData.employees || null,
                    status: 'nouveau',
                    source: 'website'
                }
            ])
            .select();

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        console.log('✅ Demande de démo enregistrée:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        return { success: false, error };
    }
}

/**
 * Enregistre une demande de rendez-vous dans Supabase
 * @param {Object} formData - Données du formulaire
 * @returns {Promise<Object>} - Résultat de l'insertion
 */
async function saveAppointmentRequest(formData) {
    if (!supabaseClient) {
        if (!initSupabase()) {
            return { success: false, error: 'Supabase non initialisé' };
        }
    }

    try {
        const { data, error } = await supabaseClient
            .from('appointment_requests')
            .insert([
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    preferred_date: formData.date || null,
                    preferred_time: formData.time || null,
                    subject: formData.subject || null,
                    status: 'en_attente',
                    source: 'website'
                }
            ])
            .select();

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        console.log('✅ Demande de RDV enregistrée:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        return { success: false, error };
    }
}

/**
 * Enregistre un message de contact dans Supabase
 * @param {Object} formData - Données du formulaire
 * @returns {Promise<Object>} - Résultat de l'insertion
 */
async function saveContactMessage(formData) {
    if (!supabaseClient) {
        if (!initSupabase()) {
            return { success: false, error: 'Supabase non initialisé' };
        }
    }

    try {
        const { data, error } = await supabaseClient
            .from('contact_messages')
            .insert([
                {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    status: 'non_lu',
                    source: 'website'
                }
            ])
            .select();

        if (error) {
            console.error('Erreur Supabase:', error);
            throw error;
        }

        console.log('✅ Message de contact enregistré:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        return { success: false, error };
    }
}

/**
 * Récupère les statistiques des leads (pour le dashboard)
 * @returns {Promise<Object>} - Statistiques
 */
async function getLeadStats() {
    if (!supabaseClient) {
        if (!initSupabase()) {
            return { success: false, error: 'Supabase non initialisé' };
        }
    }

    try {
        const { data, error } = await supabaseClient
            .rpc('get_lead_stats');

        if (error) throw error;

        return { success: true, stats: data[0] };
    } catch (error) {
        console.error('Erreur lors de la récupération des stats:', error);
        return { success: false, error };
    }
}

/**
 * Récupère tous les leads (pour le dashboard)
 * @param {number} limit - Nombre de résultats à retourner
 * @returns {Promise<Object>} - Liste des leads
 */
async function getAllLeads(limit = 100) {
    if (!supabaseClient) {
        if (!initSupabase()) {
            return { success: false, error: 'Supabase non initialisé' };
        }
    }

    try {
        const { data, error } = await supabaseClient
            .from('all_leads')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        return { success: true, leads: data };
    } catch (error) {
        console.error('Erreur lors de la récupération des leads:', error);
        return { success: false, error };
    }
}

/**
 * Met à jour le statut d'un lead
 * @param {string} type - Type de lead (demo, appointment, contact)
 * @param {string} id - ID du lead
 * @param {string} status - Nouveau statut
 * @returns {Promise<Object>} - Résultat de la mise à jour
 */
async function updateLeadStatus(type, id, status) {
    if (!supabaseClient) {
        if (!initSupabase()) {
            return { success: false, error: 'Supabase non initialisé' };
        }
    }

    try {
        let tableName;
        switch(type) {
            case 'demo':
                tableName = 'demo_requests';
                break;
            case 'appointment':
                tableName = 'appointment_requests';
                break;
            case 'contact':
                tableName = 'contact_messages';
                break;
            default:
                throw new Error('Type de lead invalide');
        }

        const { data, error } = await supabaseClient
            .from(tableName)
            .update({ status: status })
            .eq('id', id)
            .select();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        return { success: false, error };
    }
}

// ============================================
// Export des fonctions
// ============================================

// Initialiser au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
} else {
    initSupabase();
}

// Les fonctions sont disponibles globalement
window.LucidDB = {
    saveDemoRequest,
    saveAppointmentRequest,
    saveContactMessage,
    getLeadStats,
    getAllLeads,
    updateLeadStatus
};
